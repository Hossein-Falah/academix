import { randomBytes } from 'crypto';
import { Request } from 'express';
import { DeepPartial, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isArray } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CategoryMessage, CourseMessage } from 'src/common/enums/message.enum';
// import { CourseStudentEntity } from './entities/course-student.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationGenerator, PaginationSolver } from 'src/common/utils/pagination.util';
import { EntityNames } from 'src/common/enums/entity.enum';
import { CourseEntity } from '../entities/course.entity';
import { CourseCategoryEntity } from '../entities/course-category.entity';
import { S3Service } from 'src/modules/s3/s3.service';
import { CategoryService } from 'src/modules/category/category.service';
import { CourseDto, FilterCourseDto } from '../dto/course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Injectable({ scope: Scope.REQUEST })
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository:Repository<CourseEntity>,
    @InjectRepository(CourseCategoryEntity) private courseCategoryRepository:Repository<CourseCategoryEntity>,
    // @InjectRepository(CourseStudentEntity) private courseStudentRepository:Repository<CourseStudentEntity>,
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

  async findAll(paginationDto:PaginationDto, filterDto:FilterCourseDto) {
    const { page, limit, skip } = PaginationSolver(paginationDto);

    let { category, search, isFree, isPublished } = filterDto;

    let where = "";

    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += " AND ";
      where += "category.title = LOWER(:category)";
    }

    if (search) {
      if (where.length > 0) where += " AND ";
      search = `%${search}%`;
      where += "CONCAT(course.title, course.description, course.content) LIKE :search"
    };

    if (isFree !== undefined) {
      if (where.length > 0) where += " AND ";
      where += "course.isFree = :isFree";
    }
    
    if (isPublished !== undefined) {
      if (where.length > 0) where += " AND ";
      where += "course.isPublished = :isPublished";
    }

    const [courses, count] = await this.courseRepository.createQueryBuilder(EntityNames.Course)
      .leftJoin("course.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("course.teacher", "teacher")
      .leftJoin("teacher.profile", "profile")
      .addSelect(['categories.id', "category.title", "teacher.username", "teacher.id", "profile.nike_name"])
      .where(where, { category, search, isFree, isPublished })
      .orderBy("course.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return {
      pagination: PaginationGenerator(count, page, limit),
      courses
    }
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: {
        teacher: { profile: true }
      },
      select: {
        id:true,
        title:true,
        description:true,
        content:true,
        price:true,
        isFree:true,
        shortLink:true,
        isCompleted:true,
        isPublished:true,
        rating:true,
        hasCertificate:true,
        cover: true,
        views:true,
        teacher: {
          id:true,
          username:true,
          profile: {
            nike_name:true,
            image_profile:true
          }
        },
        createdAt:true,
        updatedAt:true
      }
    })

    if (!course) throw new NotFoundException(CourseMessage.NotFound);

    await this.courseRepository.increment({ id }, "views", 1);

    return course;
  }

  async update(id: string, courseDto: UpdateCourseDto, image:Express.Multer.File) {
    let { 
      title, description, content,
      categories, hasCertificate,
      isCompleted, isPublished, price 
    } = courseDto;

    const course = await this.checkExistCourseById(id);
        
    if (typeof categories === "string") {
      categories = categories.split(",")
    } 
    
    if (!isArray(categories)) {
      throw new BadRequestException(CategoryMessage.InValidCategory);
    }

    const updateObject: DeepPartial<CourseEntity> = {
      title: title || course.title,
      description: description || course.description,
      content: content || course.content,
      price: price || course.price,
      isCompleted: isCompleted || course.isCompleted,
      isPublished: isPublished || course.isPublished,
      hasCertificate: hasCertificate || course.hasCertificate
    }
    
    if (image) {
      const { Location } = await this.s3Service.uploadFile(image, `academix-course`);
      
      if (Location) {
        updateObject['cover'] = Location;
      }
    };

    await this.courseRepository.update({ id }, updateObject);

    await this.courseCategoryRepository.delete({ courseId: course.id });

    const categoryEntities = await Promise.all(
      categories.map(async title => {
        let category = await this.categoryService.findOneByTitle(title);
        if (!category) category = await this.categoryService.insertByTitle(title);
        return { courseId: course.id, categoryId: category.id }
      })
    )

    await this.courseCategoryRepository.insert(categoryEntities);

    return {
      message: CourseMessage.Updated
    }
  }

  async remove(id: string) {
    await this.checkExistCourseById(id);

    await this.courseCategoryRepository.delete({ courseId: id });
    await this.courseCategoryRepository.delete({ courseId: id });

    await this.courseRepository.delete({ id });

    return {
      message: CourseMessage.Removed
    }
  }

  async checkExistCourseById(id:string) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) throw new NotFoundException(CourseMessage.NotFound);
    return course;
  }

  async checkExistCourseByTitle(title:string) {
    const course = await this.courseRepository.findOneBy({ title });
    if (course) throw new ConflictException(CourseMessage.AlreadyCourse);
  }
}
