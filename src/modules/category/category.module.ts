import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from '../auth/auth.module';
import { CategoryEntity } from './entities/category.entity';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CategoryEntity])
  ],
  controllers: [CategoryController],
  providers: [CategoryService, S3Service],
})
export class CategoryModule {}
