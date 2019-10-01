import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, BaseEntity} from "typeorm";
import { LocalUser } from "./local-user";
import { LocalUserChat } from "./local-user-chat";

@Entity()
export class Mensaje extends BaseEntity {

    @PrimaryGeneratedColumn({type: 'bigint'})
    id!: number;

    @Column({type: 'text'})
    mensaje!: string;

    @Index()
    @ManyToOne(type => LocalUserChat, LocalUserChat => LocalUserChat.mensajes)
    local_user_chat!: LocalUserChat;

    @Index()
    @CreateDateColumn()
    created_at!: Date;

}