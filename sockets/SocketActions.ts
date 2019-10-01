import { Socket } from "socket.io";
import SocketIO from "socket.io";
import { ChatHandler } from "../classes/ChatHandler";

export class SocketActions {

    protected chatHandler: ChatHandler;

    constructor(protected io: SocketIO.Server) {
        // se debe sacar io de aca adentro.
        this.chatHandler = new ChatHandler(this.io);
    }

    OnconfigurarCliente(cliente: Socket) {

        return new Promise((resolve, reject) => {

            cliente.on('configurar-usuario', (payload: { nombre: string, rol: string, referencia_externa: string, id_externo: string }, callback: Function) => {
                if (payload.rol !== 'cliente') {
                    this.chatHandler.configurarUsuario(cliente.id, payload).then(LocalUser => {
                        callback({
                            usuario: LocalUser,
                            ok: true,
                            mensaje: `Usuario ${payload.nombre}, configurado`
                        });
                    });
                }
                callback({ usuario: 'JEJEJ', ok: true, mensaje: `Usuario ${payload.nombre}, configurado` });
                resolve({ rol: payload.rol });
            });

        });


    }

    OnObtenerMensajesChat(cliente: Socket) {
        cliente.on('obtener-mensajes-chat', (payload: { id_chat: string }, callback: Function) => {

            this.chatHandler.obtenerMensajesDeChat(payload, callback).then(result => {
                callback({ chats: result, ok: true });
            }).catch(err => {
                callback({ err: err, ok: false, });
            });

        });
    }


    OnDesconectar(cliente: Socket) {
        cliente.on('disconnect', () => {

            this.chatHandler.desconectar(cliente.id).then(chat_activos => {
                
            });

        });
    }

    OnObtenerChats(cliente: Socket) {
        cliente.on('obtener-usuarios', () => {

            this.chatHandler.obtenerChats().then(result => {
                this.io.emit('usuarios-activos', result);
            });

        });
    }


    OnJoinChat(cliente: Socket) {
        cliente.on('join-in-chat', (payload: { id_chat: number }, callback: Function) => {
            this.chatHandler.joinChat(cliente.id, payload.id_chat);
        });
    }
}