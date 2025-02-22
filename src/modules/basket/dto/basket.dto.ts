import { ApiProperty } from "@nestjs/swagger";

export class BasketDto {
    @ApiProperty()
    courseId:string;
}

export class DiscountBasketDto {
    @ApiProperty()
    courseId:string;
    @ApiProperty()
    code:string;
}