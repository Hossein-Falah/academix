import { Column, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogBookmarks)
export class BlogBookmarkEntity extends BaseEntity {
    @Column()
    blogId:string;
    @Column()
    userId:string;
    @ManyToOne(() => UserEntity, user => user.blog_bookmarks, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => BlogEntity, blog => blog.bookmarks, { onDelete: "CASCADE" })
    blog:BlogEntity;
}