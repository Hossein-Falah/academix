import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketDto } from './dto/ticket.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';

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
  replyToTicket() {

  }

  @Get("/user")
  findAllTicketForUser() {

  }

  @Get("/admin")
  findAllTicketForAdminOrTeacher() {

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Delete('/remove/:id')
  removeTicket(@Param('id') id: string) {
    return this.ticketService.removeTicket(id);
  }
}
