
import { getRepository } from "typeorm";
import { LocalUser } from "../entity/local-user";
import { Chat } from "../entity/chat";
import { LocalUserChat } from "../entity/local-user-chat";
import { Mensaje } from "../entity/mensaje";

export class MensajeRepository {

    static findMensajesByChat(id_chat: string) {

        return getRepository(Mensaje).createQueryBuilder("mensaje")
            .select("mensaje")
            .innerJoinAndSelect("mensaje.local_user_chat", "local_user_chat")
            .innerJoinAndSelect("local_user_chat.usuario", "ususario")
            .innerJoin("local_user_chat.chat", "chat")
            .where("chat.id = :id_chat", { id_chat: id_chat })
            .orderBy('mensaje.created_at', 'ASC')
            .getMany()
    }

    static findMensajeWithUsuario(id_mensaje: string) {

        return getRepository(Mensaje).createQueryBuilder("mensaje")
            .innerJoinAndSelect("mensaje.local_user_chat", "local_user_chat")
            .innerJoinAndSelect("local_user_chat.usuario", "ususario")
            .where("mensaje.id = :id_mensaje", { id_mensaje })
            .getOne();

    }

    static createMensaje(mensaje: string, local_user_chat: LocalUserChat) {
        return getRepository(Mensaje).createQueryBuilder("mensaje")
            .insert()
            .values([
                { mensaje, local_user_chat }
            ])
            .execute()
    }

}
