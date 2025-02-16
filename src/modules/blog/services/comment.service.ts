import { Request } from "express";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { CreateCommentDto } from "../dto/comment.dto";
import { BlogCommentEntity } from "../entities/comment.entity";
import { BlogService } from "./blog.service";
import { CommentMessage } from "src/common/enums/message.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationGenerator, PaginationSolver } from "src/common/utils/pagination.util";

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

    async find(paginationDto:PaginationDto) {
        const { page, limit, skip } = PaginationSolver(paginationDto);
        const [comments, count] = await this.blogCommentRepository.findAndCount({
            where: {},
            relations: {
                blog: true,
                user: { profile: true }
            },
            select: {
                blog: {
                    title: true
                },
                user: {
                    username: true,
                    profile: {
                        nike_name: true
                    }
                }
            },
            skip,
            take: limit,
            order: { id: 'DESC' }
        })

        return {
            pagination: PaginationGenerator(count, page, limit),
            comments
        }
    }

    async accept(id:string) {
        const comment = await this.checkExistById(id);
        if (comment.accepted) throw new BadRequestException(CommentMessage.AlreadyAccept);
        comment.accepted = true;
        await this.blogCommentRepository.save(comment);

        return {
            message: CommentMessage.Apccepted
        }
    }

    async checkExistById(id:string) {
        const comment = await this.blogCommentRepository.findOneBy({ id });
        if (!comment) throw new NotFoundException(CommentMessage.NotFound);
        return comment;
    }
}