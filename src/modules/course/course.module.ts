import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CourseEntity } from './entities/course.entity';
import { S3Service } from '../s3/s3.service';
import { CourseCategoryEntity } from './entities/course-category.entity';
// import { CourseStudentEntity } from './entities/course-student.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CourseEntity,
      CategoryEntity,
      CourseCategoryEntity,
      // CourseStudentEntity
    ])
  ],
  controllers: [CourseController],
  providers: [CourseService, CategoryService, S3Service],
})
export class CoursesModule {}
