import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { Roles } from "src/common/enums/role.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { ProfileEntity } from "./profile.entity";
import { OtpEntity } from "./otp.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { BlogBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";
import { BlogCommentEntity } from "src/modules/blog/entities/comment.entity";
// import { CourseStudentEntity } from "src/modules/course/entities/course-student.entity";
import { CourseEntity } from "src/modules/course/entities/course.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({ nullable: true, unique: true })
    username:string;
    @Column({ nullable: true, unique: true })
    phone:string;
    @Column({ nullable: true, unique: true })
    email:string;
    @Column({ default: Roles.User })
    role:string;
    @Column({ nullable: true, default: null })
    status:string;
    @Column({ nullable: true })
    new_email:string;
    @Column({ nullable: true })
    new_phone:string;
    @Column({ nullable: true, default: false })
    verify_email:boolean
    @Column({ nullable: true, default: false })
    verify_phone:boolean
    @Column({ nullable: true })
    password:true;
    @Column({ nullable: true })
    otpId:string;
    @Column({ nullable: true })
    profileId:string;
    @OneToOne(() => ProfileEntity, profile => profile.user, { nullable: true })
    @JoinColumn()
    profile:ProfileEntity;
    @OneToOne(() => OtpEntity, otp => otp.user, { nullable: true })
    @JoinColumn()
    otp:OtpEntity;
    @OneToMany(() => BlogEntity, blog => blog.author)
    blogs:BlogEntity[];
    @OneToMany(() => BlogLikesEntity, like => like.user)
    blog_likes:BlogLikesEntity[];
    @OneToMany(() => BlogBookmarkEntity, bookmarks => bookmarks.user)
    blog_bookmarks: BlogBookmarkEntity[];
    @OneToMany(() => BlogCommentEntity, comment => comment.user)
    blog_comments:BlogCommentEntity[];
    // @OneToMany(() => CourseStudentEntity, courseStudent => courseStudent.student)
    // registeredCourses: CourseStudentEntity[];
    @OneToMany(() => CourseEntity, course => course.teacher, { cascade: true })
    taughtCourses:CourseEntity[];
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;
}