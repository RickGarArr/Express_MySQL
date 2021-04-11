import { PoolConnection } from "mysql";

export function queryPromise(conexion: PoolConnection, query: string) {
    return new Promise((resolve, reject) => {
        conexion.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}