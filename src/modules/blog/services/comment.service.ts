import { Request } from "express";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { forwardRef, Inject, Injectable, Scope } from "@nestjs/common";
import { CreateCommentDto } from "../dto/comment.dto";
import { BlogCommentEntity } from "../entities/comment.entity";
import { BlogService } from "./blog.service";
import { CommentMessage } from "src/common/enums/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
    constructor(
        @InjectRepository(BlogCommentEntity) private blogCommentRepository:Repository<BlogCommentEntity>,
        @Inject(REQUEST) private request:Request,
        @Inject(forwardRef(() => BlogService)) private blogService:BlogService
    ) {}

    async createComment(commentDto:CreateCommentDto) {
        const { id: userId } = this.request.user;
        const { text, blogId, parentId } = commentDto;
        
        await this.blogService.checkExistBlogById(blogId);

        let parent = null;

        if (parentId) {
            parent = await this.blogCommentRepository.findOneBy({ id: parentId })
        }

        await this.blogCommentRepository.insert({
            text, accepted: false,
            blogId, parentId: parent ? parentId : null,
            userId
        })

        return {
            message: CommentMessage.Created
        }
    }
}