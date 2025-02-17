import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { CourseCategoryEntity } from "./course-category.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
// import { CourseStudentEntity } from "./course-student.entity";

@Entity(EntityNames.Course)
export class CourseEntity extends BaseEntity {
    @Column()
    title:string;
    @Column({ type: "varchar", length: 450 })
    description:string;
    @Column({ type: 'longtext', nullable: true })
    content:string;
    @Column({ type: "decimal", default: 0 })
    price:number;
    @Column({ default: false })
    isFree:boolean;
    @Column({ nullable: true, unique: true })
    shortLink:string;
    @Column({ nullable: true })
    cover:string;
    @Column({ default: false })
    isCompleted:boolean;
    @Column({ default: false })
    isPublished:boolean;
    @Column({ type: "float", default: 0 })
    rating:number;
    @Column({ default: false })
    hasCertificate:boolean;
    @Column({ type: 'int', default: 0 })
    views:number;
    @OneToMany(() => CourseCategoryEntity, category => category.course)
    categories:CourseCategoryEntity[];
    // @OneToMany(() => CourseStudentEntity, courseStudent => courseStudent.course)
    // students: CourseStudentEntity[];
    @ManyToOne(() => UserEntity, user => user.taughtCourses, { onDelete: "SET NULL" })
    teacher:UserEntity;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
}
