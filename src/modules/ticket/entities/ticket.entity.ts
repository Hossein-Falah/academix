import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { TicketPriority, TicketStatus } from "src/common/enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { TicketMessageEntity } from "./ticket-message.entity";

@Entity(EntityNames.Ticket)
export class TicketEntity extends BaseEntity {
    @Column()
    title:string;
    @Column()
    description:string;
    @Column({ type: "enum", enum: TicketStatus, default: TicketStatus.OPEN })
    status:TicketStatus;
    @Column({ type: "enum", enum: TicketPriority, default: TicketPriority.MEDIUM })
    priority:TicketPriority;
    @ManyToOne(() => UserEntity, user => user.tickets, { onDelete: "CASCADE" })
    user:UserEntity;
    @ManyToOne(() => UserEntity, { nullable: true })
    assignedTo?:UserEntity;
    @OneToMany(() => TicketMessageEntity, message => message.ticket, { onDelete: "CASCADE" })
    messages: TicketMessageEntity[];
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;
}