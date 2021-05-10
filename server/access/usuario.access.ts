import { PoolConnection } from 'mysql';
import Usuario from '../models/Usuario';
import { insertPromise, queryPromise } from '../helpers/mysql.promisify';
import { IUsuario } from '../interfaces/IModels';
import Conexion from '../classes/Conexion';

export default class UsuarioAccess {
    
    private conexionTransaccional?: PoolConnection;
    
    private readonly SELECT_ALL_BY_TYPE: string = 'SELECT * FROM usuarios WHERE tipo = ?';
    private readonly INSERT_USUARIO: string = 'INSERT INTO usuarios (id_usuario, email, telefono, password, fecha_creacion, tipo) VALUES (?,?,?,?,?,?)';

    constructor(conexion?: PoolConnection) {
        this.conexionTransaccional = conexion;
    }

    public create(usuario: Usuario): Promise<IInsertResult> {
        return new Promise( async (resolve, reject) => {
            const { id_usuario, email, telefono, password, fecha_creacion, tipo } = usuario;
            let conexion: PoolConnection;
            try {
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                const insert = conexion.format(this.INSERT_USUARIO, [id_usuario, email, telefono, password, fecha_creacion, tipo]);
                const result = await insertPromise(conexion, insert);
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
    
    public getUsersByType(tipo: string): Promise<Usuario[]> {
        return new Promise( async (resolve, reject) => {
            let conexion: PoolConnection;
            try{
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                const sql = conexion.format(this.SELECT_ALL_BY_TYPE, [tipo]);
                const result = await queryPromise(conexion, sql);   
                resolve(result as Usuario[]);
            } catch (err) {
                reject(err);
            } finally {
                if(!this.conexionTransaccional) {
                    conexion!.release();
                }
            }
        });
    }

    public getOneUser(params: IUsuario): Promise<Usuario> {
        return new Promise<Usuario>( async (resolve, reject) => {
            let conexion: PoolConnection;
            try {
                !this.conexionTransaccional ? conexion = await Conexion.getConexion() : conexion = this.conexionTransaccional;
                let query = 'SELECT * FROM usuarios WHERE ';
                Object.entries(params).forEach( ([key, value], index) => {
                    if ( index > 0) {
                        if (isNaN(value)) {
                            query += ` AND ${key} = '${value}'`;
                        } else {
                            query += ` AND ${key} = ${value}`;
                        }
                    } else {
                        if (isNaN(value)) {
                            query += `${key} = '${value}'`;
                        } else {
                            query += `${key} = ${value}`;
                        }
                    }
                });
                const result = await queryPromise(conexion, query);
                const usuario = (result as Usuario[])[0];
                resolve(usuario);
            } catch (err) {
                reject(err);
            } finally {
                if (!this.conexionTransaccional) {
                    conexion!.release();
                }
            }
        });
    }

}