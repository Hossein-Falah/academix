import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BlogStatus } from "src/common/enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogCategoryEntity } from "./blog-category.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title:string;
    @Column({ length: 500 })
    description:string;
    @Column({ type: "longtext" })
    content:string;
    @Column()
    image:string;
    @Column({ nullable: true })
    imageKey:string;
    @Column({ unique: true })
    slug:string;
    @Column()
    time_for_stady:string;
    @Column({ default: BlogStatus.Draft })
    status:string
    @Column({ default: 0 })
    view:number;
    @Column()
    authorId:string;
    @ManyToOne(() => UserEntity, user => user.blogs, { onDelete: "CASCADE" })
    author:UserEntity;
    @OneToMany(() => BlogCategoryEntity, category => category.blog)
    categories: BlogCategoryEntity[];
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;
}