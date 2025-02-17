import { ApiQuery } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const FilterBlog = () => {
    return applyDecorators(
        ApiQuery({ name: "category", required:false }),
        ApiQuery({ name: "search", required: false })
    )
}

export const FilterCourse = () => {
    return applyDecorators(
        ApiQuery({ name: "search", required: false }),
        ApiQuery({ name: "category", required: false }),
        ApiQuery({ name: "isFree", required: false, type: Boolean }),
        ApiQuery({ name: "isPublished", required: false, type: Boolean })
    )
}