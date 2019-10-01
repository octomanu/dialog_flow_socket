import "reflect-metadata";
import { createConnection } from "typeorm";
import Server from "./classes/server";
import router from "./routes/router";
import bodyParser from 'body-parser';
import cors from 'cors';

const server = Server.getInstance();

createConnection().then(async connection => {

    //BODY PARSER
    server.app.use(bodyParser.urlencoded({ extended: true }));
    server.app.use(bodyParser.json());

    //CORS
    server.app.use(cors({ origin: true, credentials: true }));

    //RUTAS
    server.app.use('/', router);

    //SERVIDOR
    server.start(() => {
        console.log(`el servidor esta corriendo en ${server.port}`);
    });


}).catch(error => console.log("TypeORM connection error: ", error));