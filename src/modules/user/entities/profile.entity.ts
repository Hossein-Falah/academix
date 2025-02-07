import { Column, OneToOne } from "typeorm";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { Gender } from "src/common/enums/gender.enum";
import { UserEntity } from "./user.entity";

export class ProfileEntity extends BaseEntity {
    @Column()
    nike_name:string;
    @Column({ nullable: true })
    bio:string;
    @Column({ nullable: true })
    image_profile:string;
    @Column({ nullable: true })
    bg_image:string;
    @Column({ nullable: true, enum: Gender })
    gender:string;
    @Column({ nullable: true })
    birthday:Date;
    @Column()
    userId:string;
    @OneToOne(() => UserEntity, user => user.profile, { onDelete: 'CASCADE' })
    user:UserEntity;
}