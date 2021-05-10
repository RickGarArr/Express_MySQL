import { PoolConnection } from "mysql";
import Conexion from "../../classes/Conexion";
import { IDocumentos, ISolicitud } from "../../interfaces/IModels";
import DocumentosAccess from "../documentos.access";
import SolicitudAccess from "../solicitud.access";
import { commitPromise, rollbackPromise } from '../../helpers/mysql.promisify';

export default class SolicitudProcedure {

    private conexionTransaccional?: PoolConnection;

    constructor(conexion?: PoolConnection) {
        this.conexionTransaccional = conexion;
    }

    public createSolicitud(documentos: IDocumentos, solicitud: ISolicitud) {
        return new Promise(async(resolve, reject) => {
            let conexion: PoolConnection;
            try {
                conexion = !this.conexionTransaccional ? await Conexion.getConexion() : this.conexionTransaccional;
                conexion.beginTransaction(async (err) => {
                    if (err) throw new Error('error al iniciar la transaccion');
                    try {
                        const documentosAccess = new DocumentosAccess(conexion);
                        const resultInsertDocumentos = await documentosAccess.create(documentos);
                        solicitud.id_documentos = resultInsertDocumentos.insertId;
                        const solicitudAccess = new SolicitudAccess(conexion);
                        const resultInsertSolicitud = solicitudAccess.create(solicitud);
                        await commitPromise(conexion);
                        resolve(resultInsertSolicitud);
                    } catch (error) {
                        reject(error);
                        await rollbackPromise(conexion);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    }
}