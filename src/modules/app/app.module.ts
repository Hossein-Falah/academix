import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/configs/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { BlogModule } from '../blog/blog.module';
import { CoursesModule } from '../course/course.module';
import { ChapterModule } from '../chapter/chapter.module';
import { SesstionModule } from '../sesstion/sesstion.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketModule } from '../basket/basket.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderModule } from '../order/order.module';
import { HttpApiModule } from '../http/http.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
    CoursesModule,
    ChapterModule,
    SesstionModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    OrderModule,
    HttpApiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
