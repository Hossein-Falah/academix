import { Module } from '@nestjs/common';
import { SesstionService } from './sesstion.service';
import { SesstionController } from './sesstion.controller';

@Module({
  controllers: [SesstionController],
  providers: [SesstionService],
})
export class SesstionModule {}
