import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TicketPriority } from "src/common/enums/status.enum";

export class TicketDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title:string;
    
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    description:string;
    
    @ApiPropertyOptional({ enum: TicketPriority })
    @IsEnum(TicketPriority)
    priority: TicketPriority
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    message?:string;
}