import { DialogFlowHandler } from "../classes/DialogFlowHandler";
import SocketIO, { Socket } from "socket.io";

export class SocketDfActions {

    protected DfHandler: DialogFlowHandler;

    constructor(protected io: SocketIO.Server) {

        this.DfHandler = new DialogFlowHandler(this.io);

    }

    welcome(cliente: Socket) {

        const welcomeEvent = { name: 'WELCOME', languageCode: 'en' }

        this.DfHandler.sendEventToAgent(cliente.id, welcomeEvent).then((resp: any[]) => {
            const mensaje = resp[0].queryResult.fulfillmentText;

            this.emitBotMessage(cliente, mensaje);
        });
    }


    OnMensaje(cliente: Socket) {

        cliente.on('enviar-mensaje-bot', (payload: { de: string, mensaje: string }) => {

            this.emitBotMessage(cliente, payload.mensaje, payload.de);

            this.DfHandler.enviarMensajeAgante(cliente.id, payload.mensaje)
                .then(respuestas => {

                    const mensaje = respuestas[0].queryResult.fulfillmentText;

                    this.emitBotMessage(cliente, mensaje);

                    return this._checkOperatorMode(respuestas[0]);

                })
                .then(operator_mode => {

                    if (!operator_mode) return;

                    const external_user = { nombre: 'nombre', referencia_externa: "ref_exte", id_externo: "id_externo" };

                    this.DfHandler.cambiarOperador(external_user, cliente);

                });
        });



    }

    private emitBotMessage(cliente: Socket, mensaje: string, de = 'OctoBot') {
        this.io.in(cliente.id).emit('mensaje-nuevo-bot', { de, cuerpo: mensaje });
    }

    private _checkOperatorMode(respuesta: any) {
        let contexts = respuesta.queryResult.outputContexts;
        let operatorMode = false;
        for (const context of contexts) {
            const parts = context.name.split('/');
            const name = parts[parts.length - 1];
            if (name === 'operator_request') {
                operatorMode = true;
                break;
            }
        }
        return operatorMode;
    }
}