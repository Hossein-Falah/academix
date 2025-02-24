import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { BasketService } from '../basket/basket.service';
import { StripeService } from '../http/stripe.service';
import { PaymentEntity } from './entities/payment.entity';
import { BasketMessage } from 'src/common/enums/message.enum';
import { OrderService } from '../order/order.service';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private request:Request,
    @InjectRepository(PaymentEntity) private paymentRepository:Repository<PaymentEntity>,
    private basketService:BasketService,
    private stripeService:StripeService,
    private orderService:OrderService
  ) {}

  async getGatewayUrl(paymentDto: PaymentDto) {
    const { id: userId, email, phone } = this.request.user;

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
      const sesstion = await this.stripeService.createCheckoutSession(
        basket.courses,
        basket.finalAmount,
        userId
      )

      return { gatewayUrl: sesstion.url, sesstionId: sesstion.id }
    }
  }
}
