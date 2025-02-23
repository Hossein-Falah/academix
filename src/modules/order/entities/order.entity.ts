import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { OrderStatus } from "src/common/enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { OrderItemEntity } from "./order-item.entity";
import { PaymentEntity } from "src/modules/payment/entities/payment.entity";

@Entity(EntityNames.Order)
export class OrderEntity extends BaseEntity {
    @Column()
    userId:string;
    @Column()
    payment_amount:number;
    @Column()
    discount_amount:number;
    @Column()
    total_amount:number;
    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
    status:string;
    @Column({ nullable: true })
    description:string;
    @ManyToOne(() => UserEntity, user => user.orders, { onDelete: "CASCADE" })
    user:UserEntity;
    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];
    @OneToOne(() => PaymentEntity, payment => payment.order, { onDelete: "SET NULL" })
    @JoinColumn()
    payments:PaymentEntity;
}