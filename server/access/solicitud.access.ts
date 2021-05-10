import { PoolConnection } from "mysql";
import Documentos from "../models/Documentos";
import Solicitud from "../models/Solicitud";
import { commitPromise, insertPromise, queryPromise, rollbackPromise } from "../helpers/mysql.promisify";
import { ISolicitud } from "../interfaces/IModels";
import Conexion from "../classes/Conexion";
import DocumentosAccess from "./documentos.access";

export default class SolicitudAccess {

    private conexionTransaccional?: PoolConnection;

    private readonly INSERT_SOLICITUD = 'INSERT INTO solicitudes (nombre, email, telefono, id_documentos, fecha_creacion) VALUES (?,?,?,?,?)';
    private readonly SELECT_ALL = 'SELECT * FROM solicitudes limit ?, ?';

    constructor(conexion?: PoolConnection) {
        this.conexionTransaccional = conexion;
    }

    public create(solicitud: ISolicitud) {
        return new Promise<IInsertResult>(async (resolve, reject) => {
            let conexion: PoolConnection;
            const { nombre, email, telefono, fecha_creacion, id_documentos } = solicitud;
            try {
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                const query = conexion.format(this.INSERT_SOLICITUD, [nombre, email, telefono, id_documentos, fecha_creacion]);
                const result = await insertPromise(conexion, query);
                resolve(result);
            } catch (error) {
                if ((error.sqlMessage as string).includes('email')) {
                    reject('Correo electronico ya está registrado');
                } else if ((error.sqlMessage as string).includes('telefono')) {
                    reject('Telefono ya está registrado');
                } else {
                    reject('error inesperado');
                }
            } finally {
                if (!this.conexionTransaccional) {
                    conexion!.release();
                }
            }
        });
    }

    public getAll(limit: number, offset: number): Promise<Solicitud[]> {
        return new Promise(async (resolve, reject) => {
            let conexion: PoolConnection;
            try {
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                const query = conexion.format(this.SELECT_ALL, [limit, offset]);
                const result = await queryPromise(conexion, query);
                resolve(result as Solicitud[]);
            } catch (error) {
                reject(error);
            } finally {
                if (!this.conexionTransaccional) {
                    conexion!.release();
                }
            }
        });
    }
}