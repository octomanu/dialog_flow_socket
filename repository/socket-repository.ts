
import { getRepository } from "typeorm";

import { Socket as SocketEntity } from "../entity/socket";
import { LocalUser } from "../entity/local-user";

export class SocketRepository {

    static crearSocket(socket_id: string, usuario: LocalUser) {
        const socket = new SocketEntity();
        socket.socket = socket_id;
        socket.usuario = usuario;
        return socket.save()
    }

    static eliminarById(socket: string) {
        return getRepository(SocketEntity)
            .createQueryBuilder("socket")
            .delete()
            .where("socket = :socket", { socket })
            .execute();
    }

    static findSocketsByChat(id_chat: string) {
        return getRepository(SocketEntity).createQueryBuilder("socket")
            .innerJoinAndSelect("socket.usuario", "ususario")
            .innerJoinAndSelect("ususario.local_user_chat", "local_user_chat")
            .where("local_user_chat.chat = :id_chat", { id_chat })
            .getMany();
    }

    static deleteAll() {
        return getRepository(SocketEntity).createQueryBuilder("socket")
            .delete()
            .execute()
    }

}
