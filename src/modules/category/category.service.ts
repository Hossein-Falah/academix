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
    let { title, parentId, slug, isActive } = categoryDto;
    
    title = await this.checkExistByTitle(title);

    // if check category parent existing
    let parentCategory: CategoryEntity | null = null;
    
    if (parentId) {
      parentCategory = await this.categoryRepository.findOneBy({ id: parentId });  
      if (!parentCategory) throw new NotFoundException(CategoryMessage.NotFound);
    }

    const category = this.categoryRepository.create({
      title, slug,
      isActive, parent: parentCategory
    });

    await this.categoryRepository.save(category);

    return {
      message: CategoryMessage.Created
    }
  }

  async insertByTitle(title:string) {
    const category = this.categoryRepository.create({
      title,
      slug: title,
      isActive: false
    })

    return await this.categoryRepository.save(category);
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit, page, skip } = PaginationSolver(paginationDto);
    let [categories, count] = await this.categoryRepository.findAndCount({
      relations: ['children', 'parent'],
      skip,
      take: limit
    });

    categories = categories.filter(category => !category.parent);    

    return {
      categories,
      pagination: PaginationGenerator(count, page, limit)
    }
  }

  async findOneBySlug(slug:string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async findOneByTitle(title:string) {
    return this.categoryRepository.findOneBy({ title });
  }
  
  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["children"]
    });
    if (!category) throw new NotFoundException(PublicMessage.NotFound);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { title, isActive, slug } = updateCategoryDto;
    if (title) category.title = title;
    if (slug) category.slug = slug;
    if (isActive) category.isActive = isActive;

    await this.categoryRepository.save(category);

    return {
      message: CategoryMessage.Updated
    }
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
