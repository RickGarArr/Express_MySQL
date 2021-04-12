import { Router } from 'express';
import { check} from 'express-validator';
import SolicitudCtrl from '../controllers/solicitud.controller';
import { saveDocuments } from '../middlewares/solicitudFiles';
import validarCampos from '../middlewares/validarCampos';


const solicitudRoutes = Router();

solicitudRoutes.post('/create', [
    saveDocuments,
    check('nombre', 'el parametro {nombre} es necesario').notEmpty().trim().escape(),
    check('email', 'el parametro {email} es necesario').notEmpty().trim().escape(),
    check('telefono', 'el parametro {telefono} es necesario').notEmpty().trim().escape(),
    validarCampos
], SolicitudCtrl.create);

export default solicitudRoutes;