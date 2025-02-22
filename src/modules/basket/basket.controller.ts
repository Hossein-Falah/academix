import { Body, Controller, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { BasketDto } from './dto/basket.dto';

@Controller('basket')
@ApiTags("Basket")
@AuthDecorator()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  addToBasket(@Body() basketDto:BasketDto) {
    return this.basketService.addToBasket(basketDto)
  }
}
