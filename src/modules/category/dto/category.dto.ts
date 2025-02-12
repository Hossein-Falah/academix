import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CategoryDto {
    @ApiProperty()
    title:string;
    @ApiPropertyOptional()
    priority:number;
    @ApiPropertyOptional()
    parentId:string;
}
