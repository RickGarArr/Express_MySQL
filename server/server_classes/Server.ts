import Express from 'express';

export default class Server {
    private app: Express.Application;
    private port: number;

    constructor() {
        this.app = Express();
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({extended: true}));
        this.port = Number(process.env.PORT);
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log('aplicacion corriendo en el puerto: ', this.port);
        });
    }

    public getApp() {
        return this.app;
    }
}