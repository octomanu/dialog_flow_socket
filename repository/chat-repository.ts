
import { getRepository } from "typeorm";
import { Chat } from "../entity/chat";
import { LocalUser } from "../entity/local-user";
import { LocalUserChat } from "../entity/local-user-chat";

export class ChatRepository {

    static findChatsAbiertos() {
        return getRepository(Chat).createQueryBuilder("chat")
            .innerJoinAndSelect("chat.local_user_chat", "local_user_chat")
            .innerJoinAndSelect("local_user_chat.usuario", "usuario")
            .where("chat.activo = :activo", { activo: true })
            .getMany()
    }


    static crearChat(created_by: LocalUser) {


        const local_user_chat = new LocalUserChat();

        local_user_chat.usuario = created_by;

        return getRepository(Chat).createQueryBuilder("chat")
            .insert()
            .values({ created_by, local_user_chat: [local_user_chat] })
            .execute()
            .then();
    }


}
