import { PoolConnection } from "mysql";
import Documentos from "../dominio/Documentos";
import { commitPromise, insertPromise, queryPromise, rollbackPromise } from "../helpers/mysql.promisify";
import { ISolicitud } from "../interfaces/IDominio";
import Conexion from "../server_classes/Conexion";
import DocumentosAccess from "./documentos.access";

export default class SolicitudAccess {

    private conexionTransaccional?: PoolConnection;

    private readonly INSERT_SOLICITUD = 'INSERT INTO solicitudes (nombre, email, telefono, id_documentos, fecha_creacion) VALUES (?,?,?,?,?)';

    constructor(conexion?: PoolConnection) {
        this.conexionTransaccional = conexion;
    }

    public async create(documentos: Documentos, solicitud: ISolicitud) {
        return new Promise<IInsertResult>(async (resolve, reject) => {
            let conexion: PoolConnection;
            try {
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                conexion.beginTransaction( async (err) => {
                    if (err) throw new Error('error al iniciar la transaccion');
                    try {
                        const docAccess = new DocumentosAccess(conexion);
                        const result = await docAccess.create(documentos);
                        const querySol = conexion.format(this.INSERT_SOLICITUD, [solicitud.nombre, solicitud.email, solicitud.telefono, (result as IInsertResult).insertId, solicitud.fecha_creacion]);
                        const result2 = await insertPromise(conexion, querySol);
                        await commitPromise(conexion);
                        resolve(result2);
                    } catch (error) {
                        rollbackPromise(conexion).catch( err => reject(err));
                        conexion.rollback((err) => {if (err) console.log(err) });
                        if ((error.sqlMessage as string).includes('email')) {
                            reject('Correo electronico ya está registrado');
                        } else if ((error.sqlMessage as string).includes('telefono')){
                            reject('Telefono ya está registrado');
                        } 
                        reject('error inesperado');
                    }
                });
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