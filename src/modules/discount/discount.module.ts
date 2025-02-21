import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountEntity
    ])
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
