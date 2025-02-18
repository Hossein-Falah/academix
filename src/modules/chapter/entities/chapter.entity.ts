import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { CourseEntity } from "src/modules/course/entities/course.entity";

@Entity(EntityNames.Chapter)
export class ChapterEntity extends BaseEntity {
    @Column({ type: "varchar", length: 255 })
    title:string;
    @Column({ type: "text", nullable: true })
    description?:string;
    @Column({ type: "int", default: 1 })
    order:number;
    @ManyToOne(() => CourseEntity, course => course.chapters, { onDelete: "CASCADE" })
    course:CourseEntity;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
}