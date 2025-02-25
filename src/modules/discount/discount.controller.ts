import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { DiscountDto } from './dto/discount.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('discount')
@ApiTags("discount")
@AuthDecorator()
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
  
  @Post()
  @CanAccess(Roles.Admin)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  create(@Body() discountDto: DiscountDto) {
    return this.discountService.create(discountDto);
  }
  
  @Get()
  @CanAccess(Roles.Admin)
  findAll() {
    return this.discountService.findAll();
  }
  
  @Delete(':id')
  @CanAccess(Roles.Admin)
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
