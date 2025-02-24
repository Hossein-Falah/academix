import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';

@Controller('order')
@ApiTags("orders")
@AuthDecorator()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/user")
  findUserOrders() {
    return this.orderService.findUserOrders();
  }

  @Get("/admin")
  @CanAccess(Roles.Admin)
  findAllOrdersForAdmin() {
    return this.orderService.findAllOrderForAdmin();
  }
}
