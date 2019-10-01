import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique, BaseEntity } from "typeorm";
import { Socket as SocketEntity } from "./socket";
import { LocalUserChat } from "./local-user-chat";
import { Chat } from "./chat";

@Unique('identificador_usuario_externo', ['referencia_externa', 'id_externo'])
@Entity()
export class LocalUser extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    referencia_externa!: string;

    @Column()
    id_externo!: string;

    @OneToMany(type => SocketEntity, SocketEntity => SocketEntity.usuario)
    sockets!: SocketEntity[];

    @OneToMany(type => LocalUserChat, LocalUserChat => LocalUserChat.usuario)
    local_user_chat!: LocalUserChat[];

    @OneToMany(type => Chat, Chat => Chat.created_by)
    main_chats!: Chat[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    fill(nombre: string, referencia_externa: string, id_externo: string) {
        this.nombre = nombre;
        this.referencia_externa = referencia_externa;
        this.id_externo = id_externo;
    }


}