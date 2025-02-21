import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { CourseEntity } from "./course.entity";

@Entity(EntityNames.CourseComment)
export class CourseCommentEntity extends BaseEntity {
    @Column()
    text:string;
    @Column({ default: false })
    accepted:boolean;
    @Column()
    courseId:string;
    @Column()
    userId:string;
    @Column({ nullable: true })
    parentId:string;
    @ManyToOne(() => UserEntity, user => user.course_comments, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => CourseEntity, course => course.comments, { onDelete: "CASCADE" })
    course:CourseEntity;
    @ManyToOne(() => CourseCommentEntity, parent => parent.children, { onDelete: "CASCADE" })
    parent: CourseCommentEntity;
    @OneToMany(() => CourseCommentEntity, comment => comment.parent)
    @JoinColumn({ name: "parent" })
    children: CourseCommentEntity[];
    @CreateDateColumn()
    created_at:Date;
}