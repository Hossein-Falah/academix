import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SesstionDto } from './dto/sesstion.dto';
import { SesstionEntity } from './entities/sesstion.entity';
import { S3Service } from '../s3/s3.service';
import { ChapterEntity } from '../chapter/entities/chapter.entity';
import { ChapterMessage, SesstionMessage } from 'src/common/enums/message.enum';


@Injectable()
export class SesstionService {
  constructor(
    @InjectRepository(SesstionEntity) private sesstionRepository: Repository<SesstionEntity>,
    @InjectRepository(ChapterEntity) private chapterRepository: Repository<ChapterEntity>,
    private s3Service:S3Service
  ) {}

  async create(sesstionDto: SesstionDto, file:Express.Multer.File) {    
    const { title, order, isFree, duration, chapterId } = sesstionDto;
    
    const chapter = await this.chapterRepository.findOne({ where: { id: chapterId } });
    if (!chapter) throw new NotFoundException(ChapterMessage.NotFound);

    let videoUrl:string | null = null;

    if (file) {
      try {
        const { Location } = await this.s3Service.uploadVideo(file, "academix-sesstion")
        videoUrl = Location;
        
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException("خطا در آپلود ویدیو");
      }
    }

    const sesstion = this.sesstionRepository.create({
      title, order, isFree,
      videoUrl, duration,
      chapter
    })

    await this.sesstionRepository.save(sesstion);
    
    return {
      message: SesstionMessage.uploaded,
      sesstion
    }
  }

  async findAll(chapterId:string) {
    return await this.sesstionRepository.find({
      where: {
        chapter: {
          id: chapterId
        }
      },
      order: {
        order: "ASC"
      }
    })
  }

  remove(id: string) {
    return `This action removes a #${id} sesstion`;
  }
}