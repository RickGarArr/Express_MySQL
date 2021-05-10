import Express from 'express';
import http from 'http';

export default class RESTServer {

    private static _instance: RESTServer;

    private _app: Express.Application;
    private _port: number = Number(process.env.PORT);
    private _httpServer: http.Server;

    private constructor() {
        this._app = Express();
        this._httpServer = http.createServer(this._app);
    }

    // getters
    public static get instance() {
        return RESTServer._instance || (RESTServer._instance = new RESTServer());
    }

    public get app(): Express.Application {
        return this._app;
    }

    public get port(): number {
        return this._port;
    }

    public get httpServer(): http.Server {
        return this._httpServer;
    }

    // methods
    public start(callback: Function): void {
        this.httpServer.listen(this._port, callback());
    }
}