import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { SwaggerConsmes } from "src/common/enums/swagger.consumes.enum";
import { CourseCommentService } from "../services/comment.service";
import { CourseCommentDto } from "../dto/comment.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { Roles } from "src/common/enums/role.enum";

@Controller("course-comment")
@ApiTags("Course Comment")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly courseCommentService: CourseCommentService) { }

    @Post()
    @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
    create(@Body() commentDto: CourseCommentDto) {
        return this.courseCommentService.create(commentDto);
    }

    @Get("/")
    @Pagination()
    find(@Query() paginationDto: PaginationDto) {
        return this.courseCommentService.find(paginationDto);
    }

    @Put('/accept/:id')
    @CanAccess(Roles.Admin, Roles.Teacher)
    accept(@Param('id') id: string) {
        return this.courseCommentService.accept(id);
    }

    @Put("/reject/:id")
    @CanAccess(Roles.Admin, Roles.Teacher)
    reject(@Param("id") id:string) {
        return this.courseCommentService.reject(id);
    }
}