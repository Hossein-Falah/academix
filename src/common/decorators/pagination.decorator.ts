import { ApiQuery } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const Pagination = () => {
    return applyDecorators(
        ApiQuery({
            name: "page",
            example: 1,
            required: false,
            type: "integer"
        }),
        ApiQuery({
            name: "limit",
            example: 10,
            required: false,
            type: "integer"
        })
    )
}