import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesstionService } from './sesstion.service';
import { SesstionController } from './sesstion.controller';
import { S3Service } from '../s3/s3.service';
import { AuthModule } from '../auth/auth.module';
import { SesstionEntity } from './entities/sesstion.entity';
import { ChapterEntity } from '../chapter/entities/chapter.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ChapterEntity,
      SesstionEntity
    ])
  ],
  controllers: [SesstionController],
  providers: [SesstionService, S3Service],
})
export class SesstionModule {}
