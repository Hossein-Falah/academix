import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { BasketDto, DiscountBasketDto } from './dto/basket.dto';
import { BasketEntity } from './entities/basket.entity';
import { CourseService } from '../course/services/course.service';
import { BasketMessage, DiscountMessage } from 'src/common/enums/message.enum';
import { DiscountService } from '../discount/discount.service';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private basketRepository:Repository<BasketEntity>,
    @Inject(REQUEST) private request:Request,
    private courseService:CourseService,
    private discountService:DiscountService
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

  async applyDiscount(discountBasketDto:DiscountBasketDto) {
    const { id:userId } = this.request.user; 
    const { code } = discountBasketDto;

    const discount = await this.discountService.findOneByCode(code);

    if (!discount.active) {
      throw new BadRequestException(DiscountMessage.NotActive);
    }

    if (discount.limit && discount.limit <= discount.usege) {
      throw new BadRequestException(DiscountMessage.UsegeLimit);
    }

    if (discount?.expires_in && discount?.expires_in?.getTime() <= new Date().getTime()) {
      throw new BadRequestException(DiscountMessage.Expires_code);
    }

    const userBasketDiscount = await this.basketRepository.findOneBy({
      discountId: discount.id,
      userId
    });

    if (userBasketDiscount) {
      throw new BadRequestException(DiscountMessage.AlreadyUseDiscount)
    }

    const basketItem = this.basketRepository.create({
      courseId: discount.courseId,
      discountId: discount.id,
    });

    await this.basketRepository.save(basketItem);

    return {
      message: DiscountMessage.ApplyDiscount
    }
  }

  async removeFromBasketId(id:string) {
    let basketItem = await this.basketRepository.findOneBy({ id });
    if (basketItem) {
      await this.basketRepository.delete({ id: basketItem.id });
    } else {
      throw new NotFoundException(BasketMessage.NotFound);  
    }

    return {
      message: BasketMessage.Removed
    }
  }

  async removeDiscountFormBasket(discountBasketDto:DiscountBasketDto) {
    const { id: userId } = this.request.user;
    const { code } = discountBasketDto;
    const discount = await this.discountService.findOneByCode(code);
    const basketDiscount = await this.basketRepository.findOne({
      where: {
        discountId: discount.id
      }
    });

    if (!basketDiscount) throw new NotFoundException(DiscountMessage.NotFound);

    await this.basketRepository.delete({ discountId: discount.id, userId });

    return {
      message: DiscountMessage.Removed
    }
  }
}
