import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { AuthModule } from '../auth/auth.module';
import { TicketEntity } from './entities/ticket.entity';
import { TicketMessageEntity } from './entities/ticket-message.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TicketEntity,
      TicketMessageEntity
    ])
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
