import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { ChapterEntity } from "src/modules/chapter/entities/chapter.entity";

@Entity(EntityNames.Sesstion)
export class SesstionEntity extends BaseEntity {
    @Column({ type: "varchar", length: 255 })
    title:string;
    @Column()
    videoUrl:string;
    @Column()
    order:number;
    @Column({ default: false })
    isFree:boolean;
    @Column({ type: "time" })
    duration:string;
    @ManyToOne(() => ChapterEntity, chapter => chapter.sesstions, { onDelete: "CASCADE" })
    chapter:ChapterEntity;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
}