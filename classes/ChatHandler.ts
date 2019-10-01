import { MensajeRepository } from "../repository/mensaje-repository";
import { SocketRepository } from "../repository/socket-repository";
import { ChatRepository } from "../repository/chat-repository";
import { LocalUserRepository } from "../repository/local-user";
import { LocalUserChatRepository } from "../repository/local-user-chat-repository";

export class ChatHandler {

    constructor(protected io: SocketIO.Server) { }

    configurarUsuario(id_socket: string, payload: { nombre: string, rol: string, referencia_externa: string, id_externo: string }) {
        return LocalUserRepository.findOrCreateByReferenciaExterna(payload)
            .then(LocalUser => LocalUser)
            .then(LocalUser => {
                return SocketRepository.crearSocket(id_socket, LocalUser)
                    .then(() => LocalUser);
            })

    }

    obtenerMensajesDeChat(payload: { id_chat: string }, callback: Function) {
        return MensajeRepository.findMensajesByChat(payload.id_chat);
    };


    obtenerChats() {
        return ChatRepository.findChatsAbiertos().then(result => result);
    }

    desconectar(id_socket: string) {

        return SocketRepository.eliminarById(id_socket)
            .then(result => {
                return ChatRepository.findChatsAbiertos().then(chat_activos => chat_activos);
            })
            .then(chat_activos => {
                this.io.emit('usuarios-activos', chat_activos);
            });

    }

    joinChat(id_socket: string, id_chat: number) {

        return LocalUserRepository.getSocketUser(id_socket)
            .then(user => {
                if (!user) return;

                LocalUserChatRepository.findByUserAndChat(id_chat, user.id)
                    .then(chatAccess => {
                        if (chatAccess) return;
                        LocalUserChatRepository.createChatAccess(id_chat, user.id);
                    });

            })

    }

}