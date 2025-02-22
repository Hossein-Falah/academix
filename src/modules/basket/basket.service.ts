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
  
  async getBasket() {
    const { id: userId } = this.request.user;

    let courses = [];
    let discounts = [];
    let finalAmount = 0;
    let totalPrice = 0;
    let totalDiscountAmount = 0;
    
    const items = await this.basketRepository.find({
      where: { userId },
      relations: {
        course: true,
        discount: true
      }
    });

    if (!items.length) throw new NotFoundException(BasketMessage.NotFound);

    for (const item of items) {
      const coursePrice = +item.course.price;
      let finalPrice = coursePrice;
      let discountAmount = 0;

      if (item.discount && item.discount.active) {
        if (item.discount.expires_in && item.discount.expires_in.getTime() <= Date.now()) {
          throw new BadRequestException(DiscountMessage.Expires_code);
        } else {
          if (item.discount.percent != null) {
            discountAmount = coursePrice * ((+item.discount.percent) / 100);
          } else if (item.discount.amount != null) {
            discountAmount = +item.discount.amount;
          }
          finalPrice = coursePrice - discountAmount;
          if (finalPrice < 0) {
            finalPrice = 0;
          }
        }
      }

      totalPrice += coursePrice;
      totalDiscountAmount += discountAmount;
      finalAmount += finalPrice;

      courses.push({
        id: item.id,
        courseId: item.courseId,
        title: item.course.title,
        price: coursePrice,
        finalPrice,
        discountAmount,
        isFree: item.course.isFree,
        isPublished: item.course.isPublished
      });

      if (item.discount) {
        discounts.push({
          id: item.discount.id,
          code: item.discount.code,
          percent: item.discount.percent,
          amount: item.discount.amount,
          expires_in: item.discount.expires_in,
          active: item.discount.active
        });
      }
    }

    return {
      courses,
      discounts,
      totalPrice,
      totalDiscountAmount,
      finalAmount
    }
  }

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
    const { code, courseId } = discountBasketDto;

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
      courseId: courseId,
      discountId: discount.id,
      userId
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
