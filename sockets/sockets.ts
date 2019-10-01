import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { UsuariosLista } from "../classes/usuarios-lista";
import { SessionsClient } from "dialogflow";
import { SocketRepository } from "../repository/socket-repository";
import { MensajeRepository } from "../repository/mensaje-repository";
import { LocalUserChatRepository } from "../repository/local-user-chat-repository";
import { Socket as SocketEntity } from "../entity/socket"
export const usuariosConectados = new UsuariosLista();



export const mensaje = (cliente: Socket, io: SocketIO.Server, dialogFlow: SessionsClient) => {

    // testea esto enviando esto en una clase.
    cliente.on('enviar-mensaje-chat', (payload: { mensaje: string, chat: string }) => {
    console.log(payload);
        LocalUserChatRepository.getChatAccessFromSocket(payload.chat, cliente.id)
            .then((localUserChat: any) => {
                //Guardo el mensaje
                return MensajeRepository.createMensaje(payload.mensaje, localUserChat).then((resultCreate: any) => {
                    const id_mensaje = resultCreate.identifiers[0].id;
                    return id_mensaje;
                });

            }).then((id_mensaje: string) => {
                const socketsPromise = SocketRepository.findSocketsByChat(payload.chat).then(sockets => {
                    // console.log("SOCKETS A NOTIFICAR", sockets);
                    return sockets;
                })
                //busco el mensaje hidratado
                const mensajesPromise = MensajeRepository.findMensajeWithUsuario(id_mensaje).then((mensaje: any) => {
                    return mensaje
                });

                return Promise.all([socketsPromise, mensajesPromise]);

            })

            .then((resultado: any[]) => {

                // para mejorar esto se debe crear un canal por chat. y emitir solo en ese canal
                // y que cada persona se una al cana ldel chat.
                resultado[0].forEach((socket: SocketEntity) => {
                    console.log("socket entity", socket);
                    io.in(socket.socket).emit('mensaje-nuevo', resultado[1]);
                });
            })
            .catch((err: any) => {
                console.log("ERROR QUERY", err);
            });

        

    });
}