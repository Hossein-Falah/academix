import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isArray } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { BlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { S3Service } from 'src/modules/s3/s3.service';
import { CategoryMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { BlogStatus } from 'src/common/enums/status.enum';
import { CategoryService } from 'src/modules/category/category.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';

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
      message: PublicMessage.Created
    }
  }

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
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

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }

  async checkBlogBySlug(slug:string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }

  async checkExistBlogByTitle(title:string) {
    const blog = await this.blogRepository.findOneBy({ title });
    if (blog) throw new ConflictException(ConflictMessage.AlreadyBlog)
  }
}
