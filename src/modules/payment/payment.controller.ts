import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
@ApiTags("Payment")
@AuthDecorator()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  @Post("/checkout")
  getGatewayUrl(@Body() paymentDto:PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto)
  }

  @Get("/cancel")
  cancelPayment(@Query("sesstion_id") sesstionId:string) {
    return this.paymentService.cancelPayment(sesstionId);
  }
}
