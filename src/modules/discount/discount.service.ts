import { DeepPartial, Repository } from 'typeorm';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountDto } from './dto/discount.dto';
import { DiscountEntity } from './entities/discount.entity';
import { DiscountMessage } from 'src/common/enums/message.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>
  ) {}

  async create(discountDto: DiscountDto) {
    const { code, percent, amount, limit, expires_in } = discountDto;
    await this.checkExistCode(code);

    const discountObject: DeepPartial<DiscountEntity> = { code };

    if ((!amount && !percent) || (amount && percent)) {
      throw new BadRequestException(DiscountMessage.InValidDiscountField);
    }

    if (amount && !isNaN(parseFloat(amount.toString()))) {
      discountObject['amount'] = amount;
    } else if (percent && !isNaN(parseFloat(percent.toString()))) {
      discountObject['percent'] = percent;
    }

    if (expires_in && !isNaN(parseFloat(expires_in.toString()))) {
      const time = 1000 * 60 * 60 * 24 * expires_in;
      discountObject['expires_in'] = new Date(new Date().getTime() + time);
    }

    if (limit && !isNaN(parseFloat(limit.toString()))) {
      discountObject['limit'] = limit;
    }

    const discount = this.discountRepository.create(discountObject);
    await this.discountRepository.save(discount);

    return {
      message: DiscountMessage.Created
    }
  }

  async findAll() {
    return await this.discountRepository.find();
  }

  async remove(id: string) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException(DiscountMessage.NotFound);
    
    await this.discountRepository.delete({ id });
    
    return {
      message: DiscountMessage.Removed
    }
  }

  async checkExistCode(code:string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount) throw new ConflictException(DiscountMessage.AlreadyDiscount);
  }

  async findOneByCode(code:string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (!discount) throw new NotFoundException(DiscountMessage.NotFound);
    return discount;
  }

}
