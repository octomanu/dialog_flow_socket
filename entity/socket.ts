import { Entity, CreateDateColumn, ManyToOne, Index, BaseEntity, PrimaryColumn } from "typeorm";
import { LocalUser } from "./local-user";

@Entity()
export class Socket extends BaseEntity {

    @PrimaryColumn()
    socket!: string;

    @Index()
    @ManyToOne(type => LocalUser, LocalUser => LocalUser.sockets)
    usuario!: LocalUser;

    @CreateDateColumn()
    created_at!: Date;

}