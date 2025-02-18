import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class ChapterDto {
    @ApiProperty({ type: "string" })
    @IsNotEmpty({ message: "Title is required" })
    @Length(5, 255)
    title: string
    @ApiPropertyOptional()
    description: string;
    @ApiProperty()
    order: number;
    @ApiProperty()
    courseId: string;
}

export class UpdateChapterDto extends PartialType(ChapterDto) { }