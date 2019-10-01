
import { getRepository } from "typeorm";
import { LocalUserChat } from "../entity/local-user-chat";
import { LocalUser } from "../entity/local-user";

export class LocalUserChatRepository {

    static getChatAccessFromSocket(id_chat: string, id_socket: string) {

        return getRepository(LocalUserChat).createQueryBuilder("local_user_chat")
            .innerJoin('local_user_chat.usuario', 'local_user')
            .innerJoin('local_user.sockets', 'socket')
            .where("local_user_chat.chat = :id_chat", { id_chat })
            .andWhere("socket.socket = :id_socket", { id_socket })
            .getOne();
    }

    static createChatAccess(id_chat: number, id_usuario: number) {

        return getRepository(LocalUserChat).createQueryBuilder("chat")
            .insert()
            .values({ chat: { id: id_chat }, usuario: { id: id_usuario } })
            .execute()
    }

    static findByUserAndChat(id_chat: number, id_usuario: number) {
        return getRepository(LocalUserChat).createQueryBuilder("local_user_chat")
            .where("local_user_chat.usuario = :id_usuario", { id_usuario })
            .andWhere("local_user_chat.chat = :id_chat", { id_chat })
            .getOne();
    }
    

}
