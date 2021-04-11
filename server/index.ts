import { config } from 'dotenv';
config();

import Server from './server_classes/Server';
const server = new Server();
const app = server.getApp();

import rutas from './routes/all.routes';
app.use(rutas);

server.start();