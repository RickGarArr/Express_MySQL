import { PoolConnection, QueryOptions } from "mysql";

export function queryPromise(conexion: PoolConnection, query: string) {
    return new Promise((resolve, reject) => {
        conexion.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export function queryOptionsPromise(conexion: PoolConnection, queryOptions: QueryOptions) {
    return new Promise((resolve, reject) => {
        conexion.query(queryOptions,(err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

export function commitPromise(conexion: PoolConnection) {
    return new Promise<void>((resolve, reject)=> {
        conexion.commit((err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

export function rollbackPromise(conexion: PoolConnection) {
    return new Promise<void>((resolve, reject) => {
        conexion.rollback((err) => {
            if(err) reject(err);
            resolve();
        });
    });
}

export function insertPromise(conexion: PoolConnection, query: string): Promise<IInsertResult> {
    return new Promise<IInsertResult>((resolve, reject) => {
        conexion.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}