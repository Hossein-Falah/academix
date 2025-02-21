import { IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CourseCommentDto {
    @ApiProperty()
    @Length(5)
    text:string;
    @ApiProperty()
    @IsString()
    courseId:string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    parentId:string;
}