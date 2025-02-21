import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { AuthModule } from '../auth/auth.module';
import { ChapterEntity } from './entities/chapter.entity';
import { CourseEntity } from '../course/entities/course.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CourseEntity,
      ChapterEntity,
    ])
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
