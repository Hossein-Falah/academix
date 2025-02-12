import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryEntity } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationGenerator, PaginationSolver } from 'src/common/utils/pagination.util';

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

  async findAll(paginationDto:PaginationDto) {
    const { limit, page, skip } = PaginationSolver(paginationDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      skip,
      take: limit
    });

    return {
      categories,
      pagination: PaginationGenerator(count, page, limit)
    }
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(PublicMessage.NotFound);
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });

    return {
      message: CategoryMessage.Removed
    }
  }

  async checkExistByTitle(title:string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(ConflictMessage.AlreadyCategory);
    return title;
  }
}
