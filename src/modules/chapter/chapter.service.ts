import { Repository } from 'typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterDto, UpdateChapterDto } from './dto/chapter.dto';
import { CourseEntity } from '../course/entities/course.entity';
import { ChapterMessage, CourseMessage } from 'src/common/enums/message.enum';
import { ChapterEntity } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(ChapterEntity) private chapterRepository: Repository<ChapterEntity>
  ) {}

  async create(chapterDto: ChapterDto) {
    const { title, description, order, courseId } = chapterDto;

    await this.checkExistWithTitle(title);
    
    const course = await this.courseRepository.findOne({ where: { id: courseId }});
    if (!course) throw new NotFoundException(CourseMessage.NotFound);

    const chapter = this.chapterRepository.create({
      title,
      description,
      order,
      course
    });

    await this.chapterRepository.save(chapter);

    return {
      message: ChapterMessage.Created
    }
  }

  findAll() {
    return `This action returns all chapter`;
  }

  async findOne(id: string) {
    const chapter = await this.chapterRepository.findOne({
      where: { id }
    })
    if (!chapter) throw new NotFoundException(ChapterMessage.NotFound);

    return chapter;
  }

  update(id: number, chapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  async remove(id: string) {
    const chapter = await this.findOne(id);
    await this.chapterRepository.remove(chapter);

    return {
      message: ChapterMessage.Removed
    }
  }

  async checkExistWithTitle(title:string) {
    const chapter = await this.chapterRepository.findOneBy({ title });
    if (chapter) throw new ConflictException(ChapterMessage.AleradyChapter);
  }
}
