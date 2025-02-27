import { Module } from '@nestjs/common';
import { ChatGateway } from './support.gateway';
import { ChatService } from './support.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [ChatGateway, ChatService, JwtService],
  exports: [ChatService]
})
export class SupportModule {}
