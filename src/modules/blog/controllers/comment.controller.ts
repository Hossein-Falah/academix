import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { BlogCommentService } from "../services/comment.service";
import { SwaggerConsmes } from "src/common/enums/swagger.consumes.enum";
import { CreateCommentDto } from "../dto/comment.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

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
}