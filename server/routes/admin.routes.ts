import { Router } from 'express';
import { check, param, query } from 'express-validator';
import AdminController from '../controllers/admin.controller';
import validarCampos from '../middlewares/validarCampos';

const administradorRoutes = Router();

administradorRoutes.post('/login', [
    check('email', 'el parametro {email} es necesario').isEmail().normalizeEmail({all_lowercase: true}),
    check('password', 'el parametro {password} es necesario').notEmpty().trim().escape(),
    validarCampos
], AdminController.login);

administradorRoutes.post('/create', [
    check('email', 'el parametro {email} es necesario').isEmail().normalizeEmail({all_lowercase: true}),
    check('password', 'el parametro {password} es necesario').notEmpty().trim().escape(),
    check('telefono', 'el parametro {telefono} es necesario').notEmpty().trim().escape(),
    check('clave', 'el parametro {clave} es necesario').notEmpty().trim().escape(),
    validarCampos
], AdminController.create);

administradorRoutes.get('/usuarios/:tipo', [
    validarCampos
], AdminController.getUsuarios);

export default administradorRoutes;