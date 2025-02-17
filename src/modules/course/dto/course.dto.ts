import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CourseDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(5, 255)
    title:string;
    @ApiProperty()
    @IsNotEmpty()
    @Length(5, 450)
    description:string;
    @ApiProperty()
    @IsNotEmpty()
    content:string
    @ApiPropertyOptional({ type: "integer" })
    @IsOptional()
    price:number;
    @ApiProperty({ type: "string", format: "binary" })
    cover:string
    @ApiProperty({ type: "boolean" })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isCompleted:boolean;
    @ApiProperty({ type: "boolean" })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isPublished:boolean;
    @ApiProperty({ type: "boolean" })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    hasCertificate:boolean;
    @ApiProperty({ type: "string", isArray: true })
    categories:string[] | string;
}

export class FilterCourseDto {
    category:string;
    search:string;
    isFree:boolean;
    isPublished:boolean;
}