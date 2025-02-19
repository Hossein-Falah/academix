import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { Repository } from 'typeorm';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SesstionDto } from './dto/sesstion.dto';
import { SesstionEntity, UpdateSesstionDto } from './entities/sesstion.entity';
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
    const { title, order, isFree, chapterId } = sesstionDto;
    
    const chapter = await this.chapterRepository.findOne({ where: { id: chapterId } });
    if (!chapter) throw new NotFoundException(ChapterMessage.NotFound);

    let videoUrl:string | null = null;
    let duration:string | null = null;

    if (file) {
      try {
        const { Location } = await this.s3Service.uploadVideo(file, "academix-sesstion")
        videoUrl = Location;
        
        duration = await this.getVideoDuration(file);
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

  findAll() {
    return `This action returns all sesstion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sesstion`;
  }

  update(id: string, sesstionDto: UpdateSesstionDto) {
    return `This action updates a #${id} sesstion`;
  }

  remove(id: number) {
    return `This action removes a #${id} sesstion`;
  }

  async getVideoDuration(file: Express.Multer.File): Promise<string> {
    const tmpDir = join(__dirname, '..', '..', 'tmp');
    const tempPath = join(tmpDir, `${Date.now()}.mp4`);
  
    try {
      if (!existsSync(tmpDir)) {
        await mkdir(tmpDir, { recursive: true });
      }
  
      await writeFile(tempPath, file.buffer);
  
      return new Promise((resolve) => {
        ffmpeg(tempPath)?.ffprobe((err, metadata) => {
          if (err) {
            console.error("FFprobe Error:", err);
            return resolve("00:00"); // مقدار پیش‌فرض در صورت بروز خطا
          }
  
          const durationInSeconds = metadata?.format?.duration || 0;
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = Math.floor(durationInSeconds % 60);
          
          resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        });
      });
    } catch (error) {
      console.error("Unexpected Error in getVideoDuration:", error);
      return "00:00";
    } finally {
      if (existsSync(tempPath)) {
        await unlink(tempPath).catch(err => console.error("Failed to delete temp file:", err));
      }
    }
  }  
}