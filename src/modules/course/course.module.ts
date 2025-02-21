import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CourseEntity } from './entities/course.entity';
import { S3Service } from '../s3/s3.service';
import { CourseCategoryEntity } from './entities/course-category.entity';
// import { CourseStudentEntity } from './entities/course-student.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CourseCommentEntity } from './entities/comment.entity';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { CommentController } from './controllers/comment.controller';
import { CourseCommentService } from './services/comment.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CourseEntity,
      CategoryEntity,
      CourseCategoryEntity,
      // CourseStudentEntity,
      CourseCommentEntity
    ])
  ],
  controllers: [CourseController, CommentController],
  providers: [CourseService, CategoryService, CourseCommentService, S3Service],
})
export class CoursesModule {}
