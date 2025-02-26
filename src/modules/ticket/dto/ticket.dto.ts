import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { TicketPriority, TicketStatus } from "src/common/enums/status.enum";

export class TicketDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ enum: TicketPriority })
    @IsEnum(TicketPriority)
    priority: TicketPriority

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    message?: string;
}

export class ReplyTicketDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    ticketId: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;
}

export class TicketStatusDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    ticketId: string;
    @ApiProperty({ enum: TicketStatus })
    @IsEnum(TicketStatus)
    status:TicketStatus
}