import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('order')
@ApiTags("orders")
@AuthDecorator()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/user")
  findUserOrders() {
    return this.orderService.findUserOrders();
  }
}
