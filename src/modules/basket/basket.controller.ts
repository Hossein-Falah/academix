import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { BasketDto, DiscountBasketDto } from './dto/basket.dto';

@Controller('basket')
@ApiTags("Basket")
@AuthDecorator()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  basket() {

  }

  @Post()
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  addToBasket(@Body() basketDto:BasketDto) {
    return this.basketService.addToBasket(basketDto)
  }

  @Delete("/remove/:id")
  removeFromBasketId(@Param("id") id:string) {
    return this.basketService.removeFromBasketId(id);
  }

  @Post("/discount")
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  applyDiscountForBasket(@Body() discountBasketDto:DiscountBasketDto) {
    return this.basketService.applyDiscount(discountBasketDto);
  }

  @Delete('/discount')
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  removeDiscountFormBasket(discountBasketDto:DiscountBasketDto) {
    return this.basketService.removeDiscountFormBasket(discountBasketDto);
  }
}
