import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity";
import { CourseCategoryEntity } from "src/modules/course/entities/course-category.entity";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
    @Column()
    title:string;
    @Column()
    slug:string;
    @Column({ default: true })
    isActive:boolean
    @ManyToOne(() => CategoryEntity, category => category.children, { nullable: true, onDelete: "CASCADE" })
    parent:CategoryEntity;
    @OneToMany(() => CategoryEntity, category => category.parent)
    children: CategoryEntity[];
    @OneToMany(() => BlogCategoryEntity, blog => blog.category)
    blog_categories: BlogCategoryEntity[];
    @OneToMany(() => CourseCategoryEntity, course => course.category)
    course_categories: CourseCategoryEntity[];
}