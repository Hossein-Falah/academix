import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { TicketEntity } from "./ticket.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityNames.TicketMessage)
export class TicketMessageEntity extends BaseEntity {
    @Column({ type: "text" })
    message:string;
    @ManyToOne(() => TicketEntity, ticket => ticket.messages, { onDelete: "CASCADE" })
    ticket:TicketEntity;
    @ManyToOne(() => UserEntity)
    sender: UserEntity;
    @CreateDateColumn()
    createdAt:string;
}