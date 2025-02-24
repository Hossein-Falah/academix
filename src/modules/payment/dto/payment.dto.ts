import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaymentDto {
    @ApiPropertyOptional()
    description:string;
}