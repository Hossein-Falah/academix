import { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isArray } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { BlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { S3Service } from 'src/modules/s3/s3.service';
import { BlogMessage, CategoryMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { BlogStatus } from 'src/common/enums/status.enum';
import { CategoryService } from 'src/modules/category/category.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationGenerator, PaginationSolver } from 'src/common/utils/pagination.util';
import { EntityNames } from 'src/common/enums/entity.enum';
import { BlogLikesEntity } from '../entities/like.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikesEntity) private blogLikeRepository: Repository<BlogLikesEntity>,
    @Inject(REQUEST) private request: Request,
    private s3Service: S3Service,
    private categoryService: CategoryService
  ) { }

  async create(blogDto: BlogDto, image: Express.Multer.File) {
    const user = this.request.user;

    let { title, description, content, slug, time_for_stady, categories } = blogDto;
    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",")
    } else if (!isArray(categories)) {
      throw new BadRequestException(CategoryMessage.InValidCategory)
    }

    await this.checkExistBlogByTitle(title);

    const isExistSlug = await this.checkBlogBySlug(slug);
    if (isExistSlug) throw new ConflictException(ConflictMessage.AlreadySlug);

    const { Key, Location } = await this.s3Service.uploadFile(image, "academix-blog");

    let blog = this.blogRepository.create({
      title, description, content,
      slug, image: Location, imageKey: Key,
      status: BlogStatus.Draft,
      time_for_stady, authorId: user.id
    });

    blog = await this.blogRepository.save(blog);

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }

      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id
      })

    }

    return {
      message: BlogMessage.Created
    }
  }

  async findAllWithQuery(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { page, limit, skip } = PaginationSolver(paginationDto);
    let { category, search } = filterDto;

    let where = "";

    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += " AND ";
      where += "category.title = LOWER(:category)";
    }

    if (search) {
      if (where.length > 0) where += " AND ";
      search = `%${search}%`;
      where += "CONCAT(blog.title, blog.description, blog.content) ILIKE :search"
    };

    const [blogs, count] = await this.blogRepository.createQueryBuilder(EntityNames.Blog)
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect(['categories.id', "category.title", "author.username", "author.id", "profile.nike_name"])
      .where(where, { category, search })
      .loadRelationCountAndMap("blog.likes", "blog.likes")
      .orderBy("blog.id", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return {
      pagination: PaginationGenerator(count, page, limit),
      blogs
    }
  }

  async findOne(id: string) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: {
        author: { profile: true }
      },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        image: true,
        imageKey: true,
        slug: true,
        time_for_stady: true,
        view: true,
        likes: true,
        created_at: true,
        author: {
          id: true,
          username: true,
          profile: {
            image_profile: true,
            nike_name: true
          }
        }
      }
    })

    if (!blog) throw new NotFoundException(BlogMessage.NotFound);

    // incement count view
    await this.blogRepository.increment({ id }, "view", 1);

    return blog;
  }

  async myBlog() {
    const { id } = this.request.user;

    return await this.blogRepository.find({
      where: {
        authorId: id
      },
      order: {
        id: "DESC"
      }
    })
  }

  async findOneBySlug(slug: string) {
    const userId = this.request?.user?.id;
    const blog = await this.blogRepository.createQueryBuilder(EntityNames.Blog)
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'author.id',
        'profile.nike_name'
      ])
      .where({ slug })
      .loadRelationCountAndMap("blog.likes", "blog.likes")
      .getOne()

    if (!blog) throw new NotFoundException(BlogMessage.NotFound);

    let isLiked = false;

    if (userId) {
      isLiked = !!(await this.blogLikeRepository.findOneBy({ userId, blogId: blog.id }))
    }

    return {
      blog,
      isLiked
    }
  }

  async update(id: string, blogDto: UpdateBlogDto, image: Express.Multer.File) {
    const user = this.request.user;
    let { title, description, content, slug, time_for_stady, categories } = blogDto;

    const blog = await this.checkExistBlogById(id);

    if (typeof categories === "string") {
      categories = categories.split(',');
    };

    if (!isArray(categories) || categories.length === 0) {
      throw new BadRequestException(CategoryMessage.InValidCategory);
    };

    if (slug && slug !== blog.slug) {
      const isExistSlug = await this.checkBlogBySlug(slug);
      if (isExistSlug) throw new ConflictException(ConflictMessage.AlreadySlug);
    }

    const updateObject: DeepPartial<BlogEntity> = {
      title: title || blog.title,
      slug: slug || blog.slug,
      description: description || blog.description,
      content: content || blog.content,
      time_for_stady: time_for_stady || blog.time_for_stady
    };

    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(image, "academix-blog");

      if (Location) {
        updateObject['image'] = Location;
        updateObject['imageKey'] = Key;
        if (blog.imageKey) await this.s3Service.deleteFile(blog.imageKey);
      }
    }

    await this.blogRepository.update({ id }, updateObject);

    await this.blogCategoryRepository.delete({ blogId: blog.id });

    const categoryEntities = await Promise.all(
      categories.map(async title => {
        let category = await this.categoryService.findOneByTitle(title);
        if (!category) category = await this.categoryService.insertByTitle(title);
        return { blogId: blog.id, categoryId: category.id }
      })
    )

    await this.blogCategoryRepository.insert(categoryEntities);

    return { message: BlogMessage.Updated };
  }

  async changeStatus(id:string, status:BlogStatus) {
    await this.checkExistBlogById(id);

    if (!Object.values(BlogStatus).includes(status)) {
      throw new BadRequestException(BlogMessage.InValidStatus);
    }

    await this.blogRepository.update({ id }, { status });

    return {
      message: BlogMessage.changeStatus
    }
  }

  async remove(id: string) {
    await this.checkExistBlogById(id);
    await this.blogRepository.delete({ id });

    return {
      message: BlogMessage.Deleted
    }
  }

  async likeToggle(blogId:string) {
    const { id: userId } = this.request.user;
    await this.checkExistBlogById(blogId);
    const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });

    let message = BlogMessage.Like;

    if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
      message = BlogMessage.DisLike;
    } else {
      await this.blogLikeRepository.insert({
        blogId, userId
      })
    }

    return {
      message
    }
  }

  async checkExistBlogById(id: string) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(BlogMessage.NotFound);
    return blog;
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }

  async checkExistBlogByTitle(title: string) {
    const blog = await this.blogRepository.findOneBy({ title });
    if (blog) throw new ConflictException(BlogMessage.AlreadyBlog)
  }
}
