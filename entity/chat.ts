import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, BaseEntity, OneToMany, ManyToOne } from "typeorm";
import { LocalUser } from "./local-user";
import { LocalUserChat } from "./local-user-chat";

@Entity()
export class Chat extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: number;

    @Index()
    @CreateDateColumn()
    created_at!: Date;

    @Column({ default: true })
    activo!: Boolean;

    @OneToMany(type => LocalUserChat, LocalUserChat => LocalUserChat.chat)
    local_user_chat!: LocalUserChat[];

    @ManyToOne(type => LocalUser, LocalUser => LocalUser.main_chats )
    created_by!: LocalUser;

}