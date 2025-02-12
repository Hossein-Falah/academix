import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
    @ApiPropertyOptional({ type: "integer" })
    page:number;
    @ApiPropertyOptional({ type: "integer" })
    limit:number;
}