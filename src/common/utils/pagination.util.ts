import { PaginationDto } from "../dto/pagination.dto";

export const PaginationSolver = (paginationDto: PaginationDto) => {
    let { page = 0, limit = 0 } = paginationDto;
    if (!page || page <= 1) page = 0;
    else page = page - 1;
    
    if (!limit || limit <= 0) limit = 10;

    let skip = page * limit;

    return {
        page: page === 0 ? 1 : page,
        limit,
        skip
    }
};

export const PaginationGenerator = (count:number = 0, page:number = 0, limit:number = 0) => {
    return {
        totalCount: count,
        page: +page,
        limit: +limit,
        pageCount: Math.ceil(count / limit)
    }
}