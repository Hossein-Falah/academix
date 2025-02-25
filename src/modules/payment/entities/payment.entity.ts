import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { OrderEntity } from "src/modules/order/entities/order.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityNames.Payment)
export class PaymentEntity extends BaseEntity {
    @Column({ default: false })
    status:boolean;
    @Column()
    amount:number;
    @Column()
    invoice_number:string;
    @Column()
    userId:string;
    @Column()
    orderId:string;
    @OneToOne(() => OrderEntity, order => order.payments, {
        onDelete: "CASCADE"
    })
    order:OrderEntity;
    @ManyToOne(() => UserEntity, user => user.payments, {
        onDelete: "CASCADE"
    })
    user:UserEntity;
    @CreateDateColumn()
    createdAt:Date;
}