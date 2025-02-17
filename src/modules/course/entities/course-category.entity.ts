import { Column, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { CourseEntity } from "./course.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntityNames.CourseCategory)
export class CourseCategoryEntity extends BaseEntity {
    @Column()
    courseId:string;
    @Column()
    categoryId:string;
    @ManyToOne(() => CourseEntity, course => course.categories, { onDelete: "CASCADE" })
    course:CourseEntity;
    @ManyToOne(() => CategoryEntity, category => category.course_categories, { onDelete: "CASCADE" })
    category:CategoryEntity;
}