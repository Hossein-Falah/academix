import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isArray } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { BlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { S3Service } from 'src/modules/s3/s3.service';
import { BlogMessage, CategoryMessage, ConflictMessage } from 'src/common/enums/message.enum';
import { BlogStatus } from 'src/common/enums/status.enum';
import { CategoryService } from 'src/modules/category/category.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationGenerator, PaginationSolver } from 'src/common/utils/pagination.util';
import { EntityNames } from 'src/common/enums/entity.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository:Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity) private blogCategoryRepository:Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request:Request,
    private s3Service:S3Service,
    private categoryService:CategoryService
  ) {}

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
    
    const { Key, Location } = await this.s3Service.uploadFile(image, "academix-category");

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

  async findAllWithQuery(paginationDto:PaginationDto, filterDto:FilterBlogDto) {
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
      .orderBy("blog.id", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount()
    
    return {
      pagination: PaginationGenerator(count, page, limit),
      blogs
    }
  }

  async findOne(id:string) {
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
    await this.blogRepository.increment({id}, "view", 1);

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

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  async remove(id: string) {
    await this.checkExistBlogById(id);
    await this.blogRepository.delete({ id });

    return {
      message: BlogMessage.Deleted
    }
  }

  async checkExistBlogById(id:string) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(BlogMessage.NotFound);
    return blog;
  }

  async checkBlogBySlug(slug:string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }

  async checkExistBlogByTitle(title:string) {
    const blog = await this.blogRepository.findOneBy({ title });
    if (blog) throw new ConflictException(BlogMessage.AlreadyBlog)
  }
}
