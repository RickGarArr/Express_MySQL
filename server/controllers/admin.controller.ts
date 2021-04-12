import { Request, Response } from 'express';
import Usuario from '../dominio/Usuario';
import UsuarioAccess from '../datos/usuario.access';
import sendErrors from '../helpers/sendErrors';
import isClaveValida from '../helpers/verificarClave';
import dateFormat from '../helpers/dateFormat';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { cifrarPassword } from '../helpers/passwords';

export default class AdminController {

    public static async create(req: Request, res: Response) {
        const { email, telefono, password, clave } = req.body;
        const usuarioAccess = new UsuarioAccess();
        try {
            if (!isClaveValida(clave)) throw new Error('Error al crear usuario, clave no valida');
            const bcryptPass = await cifrarPassword(password);
            const admin = new Usuario(email, telefono, bcryptPass, dateFormat.getDate(), 'admin');
            const result = await usuarioAccess.create(admin);
            res.json({
                result: `affectedRows: ${result.affectedRows}, insertedID: ${result.insertId}`
            });
        } catch(e) {
            sendErrors(res, 400,  e.sqlMessage, 'Error al crear el usuario');
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

    public static async login(req: Request, res: Response) {
        const emailToFind = req.body.email;
        const pass = req.body.password;
        const usuarioAccess = new UsuarioAccess();
        try {
            const userDB = await usuarioAccess.getOneUser({ email: emailToFind });
            if(!userDB) throw new Error('correo y contraseña no coinciden');
            if (!compareSync(pass, userDB.password)) throw new Error('Error correo y contraseña no coinciden');
            res.json({
                userDB
            });
        } catch (err) {
            sendErrors(res, 400, err.message);
        }
    }
}