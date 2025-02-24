import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from '../auth/auth.module';
import { PaymentEntity } from './entities/payment.entity';
import { BasketService } from '../basket/basket.service';
import { StripeService } from '../http/stripe.service';
import { BasketEntity } from '../basket/entities/basket.entity';
import { CourseService } from '../course/services/course.service';
import { DiscountService } from '../discount/discount.service';
import { CourseEntity } from '../course/entities/course.entity';
import { CourseCategoryEntity } from '../course/entities/course-category.entity';
import { S3Service } from '../s3/s3.service';
import { CategoryService } from '../category/category.service';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { OrderService } from '../order/order.service';
import { OrderEntity } from '../order/entities/order.entity';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    TypeOrmModule.forFeature([
      PaymentEntity,
      BasketEntity,
      CourseEntity,
      CourseCategoryEntity,
      DiscountEntity,
      CategoryEntity,
      OrderEntity
    ])
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService, 
    BasketService, 
    StripeService, 
    CourseService, 
    DiscountService,
    S3Service,
    CategoryService,
    OrderService
  ],
})
export class PaymentModule {}