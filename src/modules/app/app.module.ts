import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/configs/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
