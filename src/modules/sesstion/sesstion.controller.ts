import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SesstionService } from './sesstion.service';
import { CreateSesstionDto } from './dto/create-sesstion.dto';
import { UpdateSesstionDto } from './dto/update-sesstion.dto';

@Controller('sesstion')
export class SesstionController {
  constructor(private readonly sesstionService: SesstionService) {}

  @Post()
  create(@Body() createSesstionDto: CreateSesstionDto) {
    return this.sesstionService.create(createSesstionDto);
  }

  @Get()
  findAll() {
    return this.sesstionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sesstionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSesstionDto: UpdateSesstionDto) {
    return this.sesstionService.update(+id, updateSesstionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sesstionService.remove(+id);
  }
}
