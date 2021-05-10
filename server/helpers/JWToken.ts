import jwt from 'jsonwebtoken';
import Conexion from '../classes/Conexion';
import { queryPromise } from './mysql.promisify';

export function getNewTokenHelper(payload: Object): Promise<string> {
    return new Promise((resolve, reject) => {
        const conexion = async () => {
            console.log('ejecutando');
            try {
                const conexion = await Conexion.getConexion();
                const result = await queryPromise(conexion, 'select * from codes where name = \'token\' ;');
                const secret = (result as RowDataPacket[])[0].code.toString();
                const token = jwt.sign(payload, secret, { expiresIn: '24h' });
                conexion.release();
                resolve(token);
            } catch (err) {
                console.log(err);
                reject('error al crear token');
            }
        }
        conexion();
    });
}

export function verifyJWTokenHelper(token: string): Promise<string | object> {
    return new Promise((resolve, reject) => {
        const asyncFunction = async () => {
            const conexion = await Conexion.getConexion();
            const result = await queryPromise(conexion, 'select * from codes where name = \'token\' ;');
            const secret = (result as RowDataPacket[])[0].code.toString();
            const user = jwt.verify(token, secret);
            if (!user) reject ('Error, token no valido');
            resolve(user);
        }
        asyncFunction();
    });
}

interface RowDataPacket {
    name: string;
    code: string;
}