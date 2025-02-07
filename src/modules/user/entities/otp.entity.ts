import { Column, Entity, OneToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code:string;
    @Column({ nullable: true })
    expiresIn:Date;
    @Column()
    userId:string;
    @OneToOne(() => UserEntity, user => user.otp, { onDelete: "CASCADE" })
    user: UserEntity;
}