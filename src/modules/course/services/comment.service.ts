import { Request } from "express";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CourseCommentEntity } from "../entities/comment.entity";
import { CourseCommentDto } from "../dto/comment.dto";
import { CourseEntity } from "../entities/course.entity";
import { CommentMessage, ConflictMessage, CourseMessage } from "src/common/enums/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class CourseCommentService {
    constructor(
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(CourseCommentEntity) private courseCommentRepository: Repository<CourseCommentEntity>,
        @Inject(REQUEST) private request: Request
    ) {}

    async create(commentDto: CourseCommentDto) {
        const { id: userId } = this.request.user;

        const { courseId, text, parentId} = commentDto;

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

    async checkExistCourseWithText(text: string) {
        const comment = await this.courseCommentRepository.findOneBy({ text });
        if (comment) throw new ConflictException(ConflictMessage.AlreadyComment);
    }

    async checkExistCourseById(id:string) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) throw new NotFoundException(CourseMessage.NotFound);
        return course;
    }
}