import express from 'express';
import { SERVER_PORT, DF_SERVICE_ACCOUNT_PATH } from '../global/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import * as socketFunctions from '../sockets/sockets';
import { SessionsClient } from 'dialogflow';
import { SocketActions } from '../sockets/SocketActions';
import { SocketDfActions } from '../sockets/SocketDfActions';
import { SocketRepository } from '../repository/socket-repository';

export default class Server {

    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    public dialogFlowClient: SessionsClient;
    private httpServer: http.Server;
    protected socketActions: SocketActions;
    protected socketDfActions: SocketDfActions;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.dialogFlowClient = new SessionsClient({ keyFilename: DF_SERVICE_ACCOUNT_PATH });
        this.socketActions = new SocketActions(this.io);
        this.socketDfActions = new SocketDfActions(this.io);

        this.escucharSockets();
    }

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {

        this.io.on('connection', cliente => {

            this.socketActions.OnconfigurarCliente(cliente)
                .then((resp: any) => resp.rol === 'cliente')
                .then((is_client: boolean) => {

                    if (!is_client) return;

                    this.socketDfActions.welcome(cliente);

                    this.socketDfActions.OnMensaje(cliente);

                });

            //Mensajes
            socketFunctions.mensaje(cliente, this.io, this.dialogFlowClient);

            //iniciar Chat
            this.socketActions.OnObtenerMensajesChat(cliente);

            //Obetener Usuarios
            this.socketActions.OnObtenerChats(cliente);

            // Desconectar
            this.socketActions.OnDesconectar(cliente);

            //Ingresar a un chat
            this.socketActions.OnJoinChat(cliente);
            
        });

    }

    start(callback: Function) {
        SocketRepository.deleteAll();
        this.httpServer.listen(this.port, callback);
    }



}