import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entities/order.entity';
import { AuthService } from '../auth/services/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      OrderEntity
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, AuthService],
})
export class OrderModule {}
