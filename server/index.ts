import { config } from 'dotenv';
config();

import { json, urlencoded } from 'express';
import CORS from 'cors';

import Server from './classes/RESTServer';
const server = Server.instance;

server.app.use(json());
server.app.use(urlencoded({extended: true}));
server.app.use(CORS({origin: true, credentials: true }));

import rutas from './routes/all.routes';
server.app.use(rutas);

server.start(() => {
    console.log('Servidor escuchando en http:localhost:' + server.port);
});