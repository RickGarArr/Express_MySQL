import { Request, Response } from 'express';
import UsuarioAccess from '../datos/usuario.access';
import sendErrors from '../helpers/sendErrors';
import isClaveValida from '../helpers/verificarClave';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import Usuario from '../dominio/Usuario';
import dateFormat from '../helpers/dateFormat';

export default class AdminController {

    public static async create(req: Request, res: Response) {
        const { email, telefono, password, clave } = req.body;
        try {
            if (!isClaveValida(clave)) throw new Error('Error al crear usuario, clave no valida');
            const bcryptPass = hashSync(password, genSaltSync(7));
            const admin = new Usuario(email, telefono, bcryptPass, dateFormat.getDate(), 'admin');
            const result = await UsuarioAccess.create(admin);
            res.json({
                result: `affectedRows: ${result.affectedRows}, insertedID: ${result.insertId}`
            });
        } catch(e) {
            sendErrors(res, 400,  e.sqlMessage, 'Error al crear el usuario');
        }
    }

    public static async getUsuarios(req: Request, res: Response) {
        const tipo: string = req.params.tipo as string;
        try {
            const usuarios = await UsuarioAccess.getAllUsersByType('admin');
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
        try {
            const userDB = await UsuarioAccess.getUserByEmail(emailToFind);
            if(!userDB) throw new Error('correo y contraseña no coinciden')
            if (!compareSync(pass, userDB.password)) throw new Error('Error corro y contraseña no coinciden');
            res.json({
                userDB
            });
        } catch (err) {
            sendErrors(res, 400, err.message);
        }
    }
}