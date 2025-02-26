import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ReplyTicketDto, TicketDto } from './dto/ticket.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';

@Controller('ticket')
@ApiTags("Ticket")
@AuthDecorator()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  create(@Body() ticketDto: TicketDto) {
    return this.ticketService.create(ticketDto);
  }

  @Put("/ticket-status/:id")
  ticketStatusManagment() {

  }

  @Post("/reply-to-ticket/:id")
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  @CanAccess(Roles.Admin, Roles.Teacher)
  replyToTicket(@Body() replyTicketDto:ReplyTicketDto) {
    return this.ticketService.replyToTicket(replyTicketDto);
  }

  @Get("/user")
  findAllTicketForUser() {
    return this.ticketService.findAllTicketForUser()
  }

  @Get("/admin")
  findAllTicketForAdminOrTeacher() {

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Delete('/remove/:id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  removeTicket(@Param('id') id: string) {
    return this.ticketService.removeTicket(id);
  }
}
