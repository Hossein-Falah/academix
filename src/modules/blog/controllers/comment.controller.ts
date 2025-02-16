import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { BlogCommentService } from "../services/comment.service";
import { SwaggerConsmes } from "src/common/enums/swagger.consumes.enum";
import { CreateCommentDto } from "../dto/comment.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { Roles } from "src/common/enums/role.enum";

@Controller("blog-comment")
@ApiTags("Comment")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogCommentController {
    constructor(private readonly commentService:BlogCommentService) {}

    @Post('/')
    @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
    createComment(@Body() commentDto:CreateCommentDto) {
        return this.commentService.createComment(commentDto);
    }

    @Get("/")
    @Pagination()
    find(@Query() paginationDto:PaginationDto) {
        return this.commentService.find(paginationDto);
    }

    @Put('/accept/:id')
    @CanAccess(Roles.Admin)
    accept(@Param('id') id:string) {
        return this.commentService.accept(id);
    }
}