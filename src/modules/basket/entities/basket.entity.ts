import { Column, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BasketDiscountType } from "src/common/enums/discount-type.enum";
import { CourseEntity } from "src/modules/course/entities/course.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { DiscountEntity } from "src/modules/discount/entities/discount.entity";

@Entity(EntityNames.Basket)
export class BasketEntity extends BaseEntity {
    @Column()
    courseId:string;
    @Column()
    userId:string;
    @Column({ type: "enum", enum: BasketDiscountType, nullable: true })
    type:string
    @Column({ nullable: true })
    discountId:string;
    @ManyToOne(() => CourseEntity, course => course.baskets, { onDelete: "CASCADE" })
    course:CourseEntity;
    @ManyToOne(() => UserEntity, user => user.basket, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => DiscountEntity, discount => discount.baskets, { onDelete: "CASCADE" })
    discount:DiscountEntity;
}