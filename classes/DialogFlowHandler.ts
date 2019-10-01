import { SessionsClient } from "dialogflow";
import { DF_SERVICE_ACCOUNT_PATH, DF_PROJECT_ID } from "../global/enviroment";
import { LocalUserRepository } from "../repository/local-user";
import { SocketRepository } from "../repository/socket-repository";
import { Socket } from "socket.io";
import { ChatRepository } from "../repository/chat-repository";
import { LocalUserChatRepository } from "../repository/local-user-chat-repository";

export class DialogFlowHandler {

    protected dialogFlow = new SessionsClient({ keyFilename: DF_SERVICE_ACCOUNT_PATH });

    constructor(protected io: SocketIO.Server) { }

    sendEventToAgent(customer_id: string, event: any) {

        return this.dialogFlow.detectIntent({
            session: this.dialogFlow.sessionPath(DF_PROJECT_ID, customer_id),
            queryInput: { event }
        });
    }

    enviarMensajeAgante(customer_id: string, mensaje: string) {

        return this.dialogFlow.detectIntent({
            session: this.dialogFlow.sessionPath(DF_PROJECT_ID, customer_id),
            queryInput: {
                text: {
                    text: mensaje,
                    languageCode: 'en'
                }
            }
        });
    }

    cambiarOperador(external_user: any, cliente: Socket) {
        LocalUserRepository.findOrCreateByReferenciaExterna(external_user)
            .then(user => {

                SocketRepository.crearSocket(cliente.id, user);

                ChatRepository.crearChat(user).then(result => {

                    const id_chat = result.identifiers[0].id;

                    this.io.in(cliente.id).emit('swith-to-person-chat', { id_chat });

                    LocalUserChatRepository.createChatAccess(id_chat, user.id).then(result => {
                        ChatRepository.findChatsAbiertos().then(result => {
                            this.io.emit('usuarios-activos', result);
                        });
                    });

                });
            });
    }


}