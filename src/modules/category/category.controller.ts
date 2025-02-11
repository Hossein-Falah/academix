import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { CategoryDto } from './dto/category.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('category')
@ApiTags("Category")
@AuthDecorator()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Post()
  @CanAccess(Roles.Admin)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  create(@Body() categoryDto: CategoryDto) {
    return this.categoryService.create(categoryDto);
  }
  
  @Get()
  @SkipAuth()
  findAll() {
    return this.categoryService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
  
  @Patch(':id')
  @CanAccess(Roles.Admin)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }
  
  @Delete(':id')
  @CanAccess(Roles.Admin)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
