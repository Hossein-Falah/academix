import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
