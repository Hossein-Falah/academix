import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { UserEntity } from '../user/entities/user.entity';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { CourseService } from '../course/services/course.service';
import { S3Service } from '../s3/s3.service';
import { CourseCategoryEntity } from '../course/entities/course-category.entity';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { DiscountService } from '../discount/discount.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BasketEntity,
      CourseEntity,
      UserEntity,
      DiscountEntity,
      CourseCategoryEntity,
      CategoryEntity
    ])
  ],
  controllers: [BasketController],
  providers: [BasketService, CourseService, S3Service, CategoryService, DiscountService],
})
export class BasketModule {}
