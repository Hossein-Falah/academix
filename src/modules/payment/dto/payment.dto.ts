import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentDto {
    @ApiPropertyOptional()
    description:string;
}

export class PaymentSessionDto {
    @IsNotEmpty()
    @IsString()
    sessionId:string;
}