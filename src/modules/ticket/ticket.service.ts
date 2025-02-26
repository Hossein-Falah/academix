import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ReplyTicketDto, TicketDto } from './dto/ticket.dto';
import { TicketEntity } from './entities/ticket.entity';
import { TicketMessageEntity } from './entities/ticket-message.entity';
import { TicketPriority, TicketStatus } from 'src/common/enums/status.enum';
import { TicketMessage } from 'src/common/enums/message.enum';
import { EntityNames } from 'src/common/enums/entity.enum';

@Injectable({ scope: Scope.REQUEST })
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketMessageEntity) private ticketMessageRepository: Repository<TicketMessageEntity>,
    @Inject(REQUEST) private request: Request
  ) { }

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

  async replyToTicket(replyTicketDto: ReplyTicketDto) {
    const { user } = this.request;
    const { ticketId, message } = replyTicketDto;

    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['messages']
    });

    if (!ticket) throw new NotFoundException(TicketMessage.Notfound);

    const messageEntity = this.ticketMessageRepository.create({
      message,
      ticket,
      sender: user
    });

    await this.ticketMessageRepository.save(messageEntity);

    return {
      message: TicketMessage.Answered
    }
  }

  async findAllTicketForUser() {
    const { user } = this.request;
    const query = this.ticketRepository.createQueryBuilder(EntityNames.Ticket)
      .where("ticket.userId = :userId", { userId: user.id })
      .leftJoin("ticket.messages", "message")
      .leftJoin("message.sender", "sender")
      .leftJoin("sender.profile", "profile")
      .addSelect([
        "ticket.id", "ticket.title", "ticket.description",
        "ticket.status", "ticket.priority",
        "ticket.createdAt", "ticket.updatedAt",
        "message.id", "message.message", "message.createdAt",
        "sender.id", "sender.username", "sender.role",
        "profile.id", "profile.nike_name", "profile.image_profile"
      ])
      .orderBy('ticket.createdAt', "DESC")

    const tickets = await query.getMany();

    if (!tickets.length) {
      throw new NotFoundException(TicketMessage.Notfound)
    }

    return tickets;
  }

  async findAllTicketForAdminOrTeacher() {
    const query = this.ticketRepository.createQueryBuilder(EntityNames.Ticket)
      .where({})
      .leftJoin("ticket.messages", "message")
      .leftJoin("message.sender", "sender")
      .leftJoin("sender.profile", "profile")
      .addSelect([
        "ticket.id", "ticket.title", "ticket.description",
        "ticket.status", "ticket.priority",
        "ticket.createdAt", "ticket.updatedAt",
        "message.id", "message.message", "message.createdAt",
        "sender.id", "sender.username", "sender.role",
        "profile.id", "profile.nike_name", "profile.image_profile"
      ])
      .orderBy('ticket.createdAt', "DESC")

    const tickets = await query.getMany();

    if (!tickets.length) {
      throw new NotFoundException(TicketMessage.Notfound)
    }

    return tickets;
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id }
    })
    if (!ticket) throw new NotFoundException(TicketMessage.Notfound);
    return ticket;
  }

  async removeTicket(id: string) {
    const ticket = await this.findOne(id);

    await this.ticketRepository.delete({ id: ticket.id });

    return {
      message: TicketMessage.Removed
    }
  }

  async checkExistTicketWithTitle(title: string) {
    const ticket = await this.ticketRepository.findOneBy({ title });
    if (ticket) throw new ConflictException(TicketMessage.ConflictTicket);
  }
}
