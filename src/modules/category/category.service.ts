import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryEntity } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>
  ) {}

  async create(categoryDto: CategoryDto) {
    let { title, priority } = categoryDto;
    title = await this.checkExistByTitle(title);

    const category = this.categoryRepository.create({
      title, priority
    });

    await this.categoryRepository.save(category);

    return {
      message: CategoryMessage.Created
    }
  }

  async findAll() {
    return await this.categoryRepository.find({
      where: {}
    })
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(PublicMessage.NotFound);
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async checkExistByTitle(title:string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(ConflictMessage.AlreadyCategory);
    return title;
  }
}
