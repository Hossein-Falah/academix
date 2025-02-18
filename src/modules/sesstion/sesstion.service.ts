import { Injectable } from '@nestjs/common';
import { CreateSesstionDto } from './dto/create-sesstion.dto';
import { UpdateSesstionDto } from './dto/update-sesstion.dto';

@Injectable()
export class SesstionService {
  create(createSesstionDto: CreateSesstionDto) {
    return 'This action adds a new sesstion';
  }

  findAll() {
    return `This action returns all sesstion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sesstion`;
  }

  update(id: number, updateSesstionDto: UpdateSesstionDto) {
    return `This action updates a #${id} sesstion`;
  }

  remove(id: number) {
    return `This action removes a #${id} sesstion`;
  }
}
