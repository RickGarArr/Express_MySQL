import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import UsuarioAccess from '../access/usuario.access';
import sendErrors from '../helpers/sendErrors';
import isClaveValida from '../helpers/verificarClave';
import dateFormat from '../helpers/dateFormat';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { cifrarPassword } from '../helpers/passwords';
import SolicitudAccess from '../access/solicitud.access';
import { getNewTokenHelper } from '../helpers/JWToken';

export default class AdminController {

    public static async create(req: Request, res: Response) {
        const { email, telefono, password, clave } = req.body;
        const fecha_creacion = dateFormat.getDateTime();
        const usuarioAccess = new UsuarioAccess();
        try {
            if (!isClaveValida(clave)) throw new Error('Error al crear usuario, clave no valida');
            const bcryptPass = await cifrarPassword(password);
            const admin = new Usuario(email, telefono, bcryptPass, fecha_creacion, 'admin');
            await usuarioAccess.create(admin);
            const payload = { email, telefono,  fecha_creacion, tipo: 'admin'};
            const token = await getNewTokenHelper(payload);
            res.json({
                token
            });
        } catch(e) {
            sendErrors(res, 400,  e.sqlMessage, 'Error al crear el usuario');
        }
    }

    public static async login(req: Request, res: Response) {
        const emailToFind = req.body.email;
        const pass = req.body.password;
        const usuarioAccess = new UsuarioAccess();
        try {
            const userDB = await usuarioAccess.getOneUser({ email: emailToFind });
            if(!userDB) throw new Error('correo y contraseña no coinciden');
            if (!compareSync(pass, userDB.password)) throw new Error('Error correo y contraseña no coinciden');
            const {password, id_usuario, ...payload } = userDB;
            const token = await getNewTokenHelper(payload);
            res.json({
                token
            });
        } catch (err) {
            sendErrors(res, 400, err.message);
        }
    }

    public static async getUsuarios(req: Request, res: Response) {
        const tipo: string = req.params.tipo as string;
        const usuarioAccess = new UsuarioAccess();
        try {
            const usuarios = await usuarioAccess.getUsersByType(tipo);
            res.json({
                usuarios
            });
        } catch (error) {
            console.log(error);
            sendErrors(res, 400, 'Error en la base de datos');
        }
    }

    public static async getCategorias(req: Request, res: Response) {
        console.log((req as any).usuario);
        const page = Number(req.query.page) || 1;
        const offset = 10;
        const limit = (page * offset) - offset;
        const solicitud = new SolicitudAccess();
        const solicitudes = await solicitud.getAll(limit, offset);
        res.json({
            solicitudes
        });
    }

}