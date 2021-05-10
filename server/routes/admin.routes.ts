import { Router } from 'express';
import { check } from 'express-validator';
import AdminController from '../controllers/admin.controller';
import validarCampos from '../middlewares/validarCampos';
import { verificaToken } from '../middlewares/verificarToken';

const administradorRoutes = Router();

// ruta para iniciar session
administradorRoutes.post('/login', [
    check('email', 'el parametro {email} es necesario').isEmail().normalizeEmail({all_lowercase: true}),
    check('password', 'el parametro {password} es necesario').notEmpty().trim().escape(),
    validarCampos
], AdminController.login);

// ruta para crear un administrado
administradorRoutes.post('/create', [
    check('email', 'el parametro {email} es necesario').isEmail().normalizeEmail({all_lowercase: true}),
    check('password', 'el parametro {password} es necesario').notEmpty().trim().escape(),
    check('telefono', 'el parametro {telefono} es necesario').notEmpty().trim().escape(),
    check('clave', 'el parametro {clave} es necesario').notEmpty().trim().escape(),
    validarCampos
], AdminController.create);

// ruta para ostrar todos los usuarios por tipo
administradorRoutes.get('/usuarios/:tipo', [
    verificaToken,
    validarCampos
], AdminController.getUsuarios);

// ruta para mostrar todas las solicitudes
administradorRoutes.get('/solicitudes', [
    verificaToken
],
AdminController.getCategorias);

export default administradorRoutes;