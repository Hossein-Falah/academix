import { Column, Entity } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
    @Column()
    title:string;
    @Column({ nullable: true })
    priority:number;
}