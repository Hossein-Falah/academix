import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";
import { SwaggerConsmes } from "src/common/enums/swagger.consumes.enum";
import { CourseCommentService } from "../services/comment.service";
import { CourseCommentDto } from "../dto/comment.dto";

@Controller("course-comment")
@ApiTags("Course Comment")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly courseCommentService: CourseCommentService) {}

    @Post()
    @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
    create(@Body() commentDto:CourseCommentDto) {
        return this.courseCommentService.create(commentDto);
    }
}