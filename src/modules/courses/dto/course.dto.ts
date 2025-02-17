import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Length } from "class-validator";
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
    @IsNumber({}, { message: "Price must be a valid number" })
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