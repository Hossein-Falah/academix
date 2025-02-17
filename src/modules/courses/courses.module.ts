import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { AuthModule } from '../auth/auth.module';
import { CourseEntity } from './entities/course.entity';
import { S3Service } from '../s3/s3.service';
import { CourseCategoryEntity } from './entities/course-category.entity';
import { CourseStudentEntity } from './entities/course-student.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CourseEntity,
      CategoryEntity,
      CourseCategoryEntity,
      CourseStudentEntity
    ])
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CategoryService, S3Service],
})
export class CoursesModule {}
