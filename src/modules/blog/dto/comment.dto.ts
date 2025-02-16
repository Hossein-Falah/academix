import { IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
    @Length(5)
    text:string;
    @ApiProperty()
    @IsString()
    blogId:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    parentId:string;
}