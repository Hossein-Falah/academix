import { ApiQuery } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const FilterBlog = () => {
    return applyDecorators(
        ApiQuery({ name: "category", required:false }),
        ApiQuery({ name: "search", required: false })
    )
}