import { Request } from 'express';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { BasketType } from 'src/common/types';
import { PaymentDto } from '../payment/dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemStatus, OrderStatus } from 'src/common/enums/status.enum';
import { OrderItemEntity } from './entities/order-item.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private orderRepository:Repository<OrderEntity>,
    @Inject(REQUEST) private request:Request,
    private dataSource:DataSource
  ) {}

  async create(basket:BasketType, paymentDto:PaymentDto) {
    const { description } = paymentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const { id:userId } = this.request.user;
      const { courses, finalAmount, totalDiscountAmount, totalPrice } = basket;

      let order = queryRunner.manager.create(OrderEntity, {
        userId,
        total_amount: totalPrice,
        discount_amount: totalDiscountAmount,
        payment_amount: finalAmount,
        description,
        status: OrderStatus.Pending
      });

      order = await queryRunner.manager.save(OrderEntity, order);
      
      let orderItems: DeepPartial<OrderItemEntity>[] = [];
      for (const item of courses) {
        orderItems.push({
          courseId: item.courseId,
          orderId: order.id,
          status: OrderItemStatus.Pending, 
        });
      }
      if (orderItems.length > 0) {
        await queryRunner.manager.insert(OrderItemEntity, orderItems);
      } else {
        throw new BadRequestException("سفارش های شما خالی می باشد");
      };

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
