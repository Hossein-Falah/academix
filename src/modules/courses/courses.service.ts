import { randomBytes, randomInt } from 'crypto';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isArray } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { CourseDto } from './dto/course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseEntity } from './entities/course.entity';
import { CategoryMessage, CourseMessage } from 'src/common/enums/message.enum';
import { S3Service } from '../s3/s3.service';
import { CategoryService } from '../category/category.service';
import { CourseCategoryEntity } from './entities/course-category.entity';

@Injectable({ scope: Scope.REQUEST })
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository:Repository<CourseEntity>,
    @InjectRepository(CourseCategoryEntity) private courseCategoryRepository:Repository<CourseCategoryEntity>,
    @Inject(REQUEST) private request:Request,
    private s3Service:S3Service,
    private categoryService:CategoryService
  ) {}

  async create(courseDto: CourseDto, image:Express.Multer.File) {
    const user = this.request.user;
    let { title, description, content, hasCertificate, isCompleted, categories, isPublished, price } = courseDto;

    if (typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(CategoryMessage.InValidCategory);
    };

    await this.checkExistCourseByTitle(title);

    const { Location } = await this.s3Service.uploadFile(image, 'academix-course');

    const generateShortLink = `http://localhost:${process.env.PORT}/courses/${randomBytes(5).toString("base64url")}`;

    let course = this.courseRepository.create({
      title, description, content,
      isFree: price > 0 ? false: true,
      isCompleted, isPublished, price,
      hasCertificate, cover: Location, shortLink: generateShortLink,
      teacher: user
    })

    course = await this.courseRepository.save(course);

    for (const title of categories) {
      let category = await this.categoryService.findOneByTitle(title);
      if (!category) {
        category = await this.categoryService.insertByTitle(title);
      };

      await this.courseCategoryRepository.insert({
        courseId: course.id,
        categoryId: category.id
      })
    }

    return {
      message: CourseMessage.Created
    }
  }

  findAll() {
    return `This action returns all courses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }

  async checkExistCourseByTitle(title:string) {
    const course = await this.courseRepository.findOneBy({ title });
    if (course) throw new ConflictException(CourseMessage.AlreadyCourse);
  }
}
