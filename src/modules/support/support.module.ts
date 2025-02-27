import { Module } from '@nestjs/common';
import { ChatGateway } from './support.gateway';
import { ChatService } from './support.service';

@Module({
  controllers: [],
  providers: [ChatGateway, ChatService],
  exports: [ChatService]
})
export class SupportModule {}
