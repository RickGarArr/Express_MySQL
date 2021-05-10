import { PoolConnection } from 'mysql';
import { insertPromise, queryPromise } from '../helpers/mysql.promisify';
import { IDocumentos } from '../interfaces/IModels';
import Conexion from '../classes/Conexion';

export default class DocumentosAccess {

    private conexionTransaccional?: PoolConnection;
    
    private readonly INSERT_DOCUMENTS = 'INSERT INTO documentos (doc_ide, doc_rfc, doc_dom) VALUES (?,?,?)';

    constructor(conexion?: PoolConnection) {
        this.conexionTransaccional = conexion;
    }

    public create(documentos: IDocumentos) {
        return new Promise<IInsertResult>( async (resolve, reject) => {
            let conexion: PoolConnection;
            try {
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                const queryDoc = conexion.format(this.INSERT_DOCUMENTS, [documentos.doc_identificacion, documentos.doc_reg_fed_cont, documentos.doc_comprobante_domicilio]);
                const result = await insertPromise(conexion, queryDoc);
                resolve(result);
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