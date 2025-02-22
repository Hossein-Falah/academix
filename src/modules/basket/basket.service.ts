import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { BasketDto } from './dto/basket.dto';
import { BasketEntity } from './entities/basket.entity';
import { CourseService } from '../course/services/course.service';
import { BasketMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private basketRepository:Repository<BasketEntity>,
    @Inject(REQUEST) private request:Request,
    private courseService:CourseService
  ) {}
  
  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.request.user;
    const { courseId } = basketDto;
    await this.courseService.checkExistCourseById(courseId);
    let basketItem = await this.basketRepository.findOne({ 
      where: {
        userId,
        courseId
      }
    });

    if (basketItem) throw new ConflictException(BasketMessage.AlreadyCourse);

    basketItem = this.basketRepository.create({
      courseId,
      userId,
    });

    await this.basketRepository.save(basketItem);

    return {
      message: BasketMessage.AddToBasket
    }
  }
}
