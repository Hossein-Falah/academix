import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TicketDto } from './dto/ticket.dto';
import { TicketEntity } from './entities/ticket.entity';
import { TicketMessageEntity } from './entities/ticket-message.entity';
import { TicketPriority, TicketStatus } from 'src/common/enums/status.enum';
import { TicketMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity) private ticketRepository:Repository<TicketEntity>,
    @InjectRepository(TicketMessageEntity) private ticketMessageRepository:Repository<TicketMessageEntity>,
    @Inject(REQUEST) private request:Request
  ) {}

  async create(ticketDto: TicketDto) {
    const { user } = this.request;
    const { title, description, priority, message } = ticketDto;

    await this.checkExistTicketWithTitle(title);

    const ticket = this.ticketRepository.create({
      title,
      description,
      priority: priority || TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      user
    })

    await this.ticketRepository.save(ticket);

    if (message) {
      const message = this.ticketMessageRepository.create({
        message: ticketDto.message,
        ticket,
        sender: user
      })

      await this.ticketMessageRepository.save(message);
    }

    return {
      message: TicketMessage.created
    }
  }

  ticketStatusManagment() {

  }

  replyToTicket() {

  }

  findAllTicketForUser() {

  }

  findAllTicketForAdminOrTeacher() {

  }
  
  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id }
    })
    if (!ticket) throw new NotFoundException(TicketMessage.Notfound);
    return ticket;
  }

  removeTicket(id:string) {

  }

  async checkExistTicketWithTitle(title:string) {
    const ticket = await this.ticketRepository.findOneBy({ title });
    if (ticket) throw new ConflictException(TicketMessage.ConflictTicket);
  }
}
