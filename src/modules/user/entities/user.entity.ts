import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { Roles } from "src/common/enums/role.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { ProfileEntity } from "./profile.entity";
import { OtpEntity } from "./otp.entity";

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
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;
}