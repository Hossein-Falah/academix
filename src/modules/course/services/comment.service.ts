import { Request } from "express";
import { IsNull, Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CourseCommentEntity } from "../entities/comment.entity";
import { CourseCommentDto } from "../dto/comment.dto";
import { CourseEntity } from "../entities/course.entity";
import { CommentMessage, ConflictMessage, CourseMessage } from "src/common/enums/message.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationGenerator, PaginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class CourseCommentService {
    constructor(
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(CourseCommentEntity) private courseCommentRepository: Repository<CourseCommentEntity>,
        @Inject(REQUEST) private request: Request
    ) { }

    async create(commentDto: CourseCommentDto) {
        const { id: userId } = this.request.user;

        const { courseId, text, parentId } = commentDto;

        await this.checkExistCourseWithText(text);
        await this.checkExistCourseById(courseId);

        let parent = null;

        if (parentId) {
            parent = await this.courseCommentRepository.findOneBy({ id: parentId });
        }

        await this.courseCommentRepository.insert({
            text, accepted: false,
            courseId, parentId: parent ? parentId : null,
            userId
        })

        return {
            message: CommentMessage.Created
        }
    }

    async find(paginationDto: PaginationDto) {
        const { page, limit, skip } = PaginationSolver(paginationDto);
        const [comments, count] = await this.courseCommentRepository.findAndCount({
            where: {},
            relations: {
                course: true,
                user: { profile: true }
            },
            select: {
                course: {
                    title: true
                },
                user: {
                    username: true,
                    profile: {
                        nike_name: true
                    }
                }
            },
            take: limit,
            skip,
            order: { id: 'DESC' }
        });

        return {
            pagination: PaginationGenerator(count, page, limit),
            comments
        }
    }

    async accept(id: string) {
        const comment = await this.checkExistById(id);
        if (comment.accepted) throw new BadRequestException(CommentMessage.AlreadyAccept);
        comment.accepted = true;
        await this.courseCommentRepository.save(comment);

        return {
            message: CommentMessage.Apccepted
        }
    }

    async reject(id: string) {
        const comment = await this.checkExistById(id);
        if (!comment.accepted) throw new BadRequestException(CommentMessage.AlreadyRejecte)
        comment.accepted = false;
        await this.courseCommentRepository.save(comment);

        return {
            message: CommentMessage.Rejected
        }
    }

    async delete(id: string) {
        await this.checkExistById(id);

        await this.courseCommentRepository.delete({ id });

        return {
            message: CommentMessage.Remove
        }
    }

    async checkExistCourseWithText(text: string) {
        const comment = await this.courseCommentRepository.findOneBy({ text });
        if (comment) throw new ConflictException(ConflictMessage.AlreadyComment);
    }

    async checkExistCourseById(id: string) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) throw new NotFoundException(CourseMessage.NotFound);
        return course;
    }

    async checkExistById(id: string) {
        const comment = await this.courseCommentRepository.findOneBy({ id });
        if (!comment) throw new NotFoundException(CommentMessage.NotFound);
        return comment;
    }
}