import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CategoryDto {
    @ApiProperty()
    title:string;
    @ApiPropertyOptional({ nullable: true })
    slug:string;
    @ApiProperty({ type: "boolean" })
    isActive:boolean;
    @ApiPropertyOptional({ nullable: true })
    parentId:string;
}
