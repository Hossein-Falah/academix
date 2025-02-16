import { Column, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntityNames.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
    @Column()
    blogId:string;
    @Column()
    categoryId:string;
    @ManyToOne(() => BlogEntity, blog => blog.categories, { onDelete: "CASCADE" })
    blog: BlogEntity;
    @ManyToOne(() => CategoryEntity, category => category.blog_categories, { onDelete: "CASCADE" })
    category: CategoryEntity;
}