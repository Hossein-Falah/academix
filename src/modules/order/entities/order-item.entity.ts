import { Column, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { OrderItemStatus } from "src/common/enums/status.enum";
import { CourseEntity } from "src/modules/course/entities/course.entity";
import { OrderEntity } from "./order.entity";

@Entity(EntityNames.OrderItem)
export class OrderItemEntity extends BaseEntity {
    @Column()
    courseId:string;
    @Column()
    orderId:string;
    @Column({
        type:"enum",
        enum: OrderItemStatus,
        default: OrderItemStatus.Pending
    })
    status:string;
    @ManyToOne(() => CourseEntity, course => course.orders, { onDelete: "CASCADE" })
    course:CourseEntity;
    @ManyToOne(() => OrderEntity, order => order.items, {
        onDelete: "CASCADE"
    })
    order:OrderEntity
}