import MySQL, { PoolConnection } from 'mysql';

export default class Conexion {
    
    private static pool: MySQL.Pool;

    public static getPool() {
        if (!Conexion.pool) {
            Conexion.pool = MySQL.createPool({
                host: 'localhost',
                port: 3300,
                user: 'test',
                password: 'test*',
                database: 'tienda',
                connectionLimit: 5
            });
        }
        Conexion.pool.on('connection', (conn: PoolConnection) => {
            console.log('conexion: ', conn.threadId);
        });

        Conexion.pool.on('release', (conn: PoolConnection) => {
            console.log('conexion released: ', conn.threadId);
        });

        return Conexion.pool;
    }

    public static getConexion(): Promise<MySQL.PoolConnection> {
        return new Promise<MySQL.PoolConnection>((resolve, reject) => {
            Conexion.getPool().getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            }); 
        });
    }

}