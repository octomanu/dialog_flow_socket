import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, BaseEntity, OneToMany } from "typeorm";
import { Chat } from "./chat";
import { LocalUser } from "./local-user";
import { Mensaje } from "./mensaje";

@Entity()
export class LocalUserChat extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: number;

    @Index()
    @ManyToOne(type => Chat, Chat => Chat.local_user_chat)
    chat!: LocalUser;

    @Index()
    @ManyToOne(type => LocalUser, LocalUser => LocalUser.local_user_chat)
    usuario!: LocalUser;

    @OneToMany(type => Mensaje, Mensaje => Mensaje.local_user_chat)
    mensajes!: Mensaje[];

    @Index()
    @CreateDateColumn()
    created_at!: Date;

}