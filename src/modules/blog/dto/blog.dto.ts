import { IsEnum, IsNotEmpty, IsNumberString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BlogStatus } from "src/common/enums/status.enum";

export class BlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 200)
    title:string;
    @ApiProperty()
    @IsNotEmpty()
    @Length(10, 500)
    description:string;
    @ApiProperty()
    @IsNotEmpty()
    content:string;
    @ApiPropertyOptional()
    slug:string;
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    time_for_stady:string;
    @ApiPropertyOptional({ type: "string", format: "binary" })
    image:string;
    @ApiProperty({ type: String, isArray: true })
    categories: string[] | string;
}

export class UpdateBlogDto extends PartialType(BlogDto) {}

export class StatusBlogDto {
    @ApiProperty({ enum: BlogStatus })
    @IsEnum(BlogStatus)
    status:BlogStatus
}

export class FilterBlogDto {
    category:string;
    search:string;
}