import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityNames.CourseStudent)
export class CourseStudentEntity extends BaseEntity {
    @Column()
    courseId:string;
    @Column()
    userId:string;
    @ManyToOne(() => UserEntity, user => user.registeredCourses, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => CourseEntity, course => course.students, { onDelete: "CASCADE" })
    course: CourseEntity;
    @CreateDateColumn()
    createdAt:Date;
}