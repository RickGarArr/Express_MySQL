import Usuario from '../dominio/Usuario';
import { queryPromise } from '../helpers/mysql.promisify';
import { IUsuario } from '../interfaces/IDominio';
import Conexion from '../server_classes/Conexion';

export default class UsuarioAccess {

    private static readonly SELECT_ALL: string = 'SELECT * FROM usuarios';
    private static readonly SELECT_ALL_BY_TYPE: string = 'SELECT * FROM usuarios WHERE tipo = ?';
    private static readonly INSERT_ADMIN: string = 'INSERT INTO usuarios (id_usuario, email, telefono, password, fecha_creacion, tipo) VALUES (?,?,?,?,?,?)';
    private static readonly SELECT_BY_EMAIL: string = 'SELECT * FROM usuarios WHERE email = ?';

    static create(usuario: Usuario): Promise<IInsertResult> {
        return new Promise( async (resolve, reject) => {
            const { id_usuario, email, telefono, password, fecha_creacion, tipo } = usuario;
            try {
                const conexion = await Conexion.getConexion();
                const insert = conexion.format(this.INSERT_ADMIN, [id_usuario, email, telefono, password, fecha_creacion, tipo]);
                const result = await queryPromise(conexion, insert);
                resolve(result as IInsertResult);
                conexion.release();
            } catch (error) {
                reject(error);
            }
        });
    }
    
    static getAllUsersByType(tipo: string): Promise<Usuario[]> {
        return new Promise( async (resolve, reject) => {
            try{
                const conexion = await Conexion.getConexion();
                const sql = conexion.format(this.SELECT_ALL_BY_TYPE, [tipo]);
                const result = await queryPromise(conexion, sql);   
                resolve(result as Usuario[]);
                conexion.release();
            } catch (err) {
                reject(err);
            }
        });
    }

    static getUserByEmail(email: string): Promise<IUsuario> {
        return new Promise<IUsuario>( async (resolve, reject) => {
            try {
                const conexion = await Conexion.getConexion();
                const sql = conexion.format(this.SELECT_BY_EMAIL, [email]);
                const result = await queryPromise(conexion, sql);
                const usuario = (result as Usuario[])[0];
                resolve(usuario as IUsuario);
                conexion.release();
            } catch (err) {
                reject(err);
            }
        });
    }

}