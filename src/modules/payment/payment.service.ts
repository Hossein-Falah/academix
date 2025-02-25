import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { BasketService } from '../basket/basket.service';
import { StripeService } from '../http/stripe.service';
import { PaymentEntity } from './entities/payment.entity';
import { BasketMessage, OrderMessage, PaymentMessage } from 'src/common/enums/message.enum';
import { OrderService } from '../order/order.service';
import { OrderStatus } from 'src/common/enums/status.enum';
import { OrderEntity } from '../order/entities/order.entity';
import { CourseStudentEntity } from '../course/entities/course-student.entity';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private request:Request,
    @InjectRepository(PaymentEntity) private paymentRepository:Repository<PaymentEntity>,
    @InjectRepository(OrderEntity) private orderRepository:Repository<OrderEntity>,
    @InjectRepository(CourseStudentEntity) private courseStudentRepository:Repository<CourseStudentEntity>,
    private basketService:BasketService,
    private stripeService:StripeService,
    private orderService:OrderService
  ) {}

  async getGatewayUrl(paymentDto: PaymentDto) {
    const { id: userId } = this.request.user;

    const basket = await this.basketService.getBasket();
    if (!basket.courses.length) throw new BadRequestException(BasketMessage.NotFound);
    
    const order = await this.orderService.create(basket, paymentDto);
    
    const payment = this.paymentRepository.create({
      amount: basket.finalAmount,
      orderId: order.id,
      status: basket.finalAmount === 0,
      userId,
      invoice_number: new Date().getTime().toString(),
    })

    await this.paymentRepository.save(payment)
    
    if (payment.status) {
      return {
        message: "مبلغ با قیمت 0 تومان با موفقعیت پرداخت شد"
      }
    } else {
      const session = await this.stripeService.createCheckoutSession(
        basket.courses,
        basket.finalAmount,
        userId
      )

      payment.invoice_number = session.id;

      await this.paymentRepository.save(payment);

      return { gatewayUrl: session.url, sessionId: session.id }
    }
  }

  async verifyPayment(sessionId:string) {
    if (!sessionId) throw new NotFoundException("Session ID is required");
    const payment = await this.findPaymentBySessionId(sessionId)

    if (payment.status) {
      throw new ConflictException(PaymentMessage.AlreadyPayment);
    }

    await this.paymentRepository.manager.transaction(async manager => {
      payment.status = true;
      await manager.save(payment);

      const order = await manager.findOne(OrderEntity, { 
        where: { id: payment.orderId },
        relations: ["items"]
      });
      
      if (!order) throw new NotFoundException(OrderMessage.NotFound);
      order.status = OrderStatus.Paid;
      await manager.save(order);

      const userId = this.request.user.id;

      await this.basketService.clearBasket(userId);

      const courseIds = order.items.map(item => item.courseId);
      for (const courseId of courseIds) {
        const courseStudent = this.courseStudentRepository.create({
          userId,
          courseId
        });

        await manager.save(courseStudent);
      }
    });

    return {
      message: PaymentMessage.bought
    }
  }

  async cancelPayment(sessionId:string) {
    if (!sessionId) throw new NotFoundException("Session ID is required");

    const payment = await this.findPaymentBySessionId(sessionId);

    payment.status = false;
    
    return await this.paymentRepository.save(payment);
  }

  private async findPaymentBySessionId(sessionId:string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOneBy({ invoice_number: sessionId });
    if (!payment) {
      throw new NotFoundException(`Payment not found for sesstion Id:${sessionId}`)
    }
    return payment;
  }
}