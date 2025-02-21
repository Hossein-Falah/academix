import { Column, Entity } from "typeorm";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";

@Entity(EntityNames.Discount)
export class DiscountEntity extends BaseEntity {
    @Column()
    code:string;
    @Column({ type: "double", nullable: true })
    percent:number;
    @Column({ type: "double", nullable: true })
    amount:number;
    @Column({ nullable: true })
    expires_in:Date;
    @Column({ nullable: true })
    limit:number;
    @Column({ nullable: true, default: 0 })
    usege:number;
    @Column({ default: true })
    active:boolean;
}
