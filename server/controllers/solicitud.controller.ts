import { Response, Request } from 'express';
import Documentos from '../dominio/Documentos';
import moment from 'moment';
import Solicitud from '../dominio/Solicitud';
import SolicitudAccess from '../datos/solicitud.access';
import { borrarCarpeta } from '../helpers/functions';
import sendErrors from '../helpers/sendErrors';

export default class SolicitudCtrl {
    public static async create(req: Request, res: Response) {
        const fecha_creacion = moment((req as any).date, 'YYYYMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
        const { nombre, email, telefono } = req.body;
        const solicitud = new Solicitud({ email, telefono, nombre, fecha_creacion });
        const documentos = new Documentos();
        Object.entries(req.files).forEach(([field, [file]]) => {
            if (field === 'doc_ine') documentos.doc_identificacion = (file as Express.Multer.File).filename;
            if (field === 'doc_rfc') documentos.doc_reg_fed_cont = (file as Express.Multer.File).filename;
            if (field === 'doc_dom') documentos.doc_comprobante_domicilio = (file as Express.Multer.File).filename;
        });
        const solicitudAccess = new SolicitudAccess();
        try {
            await solicitudAccess.create(documentos, solicitud);
            res.json({
                ok: true
            });
        } catch (error) {
            await borrarCarpeta((req as any).directorio);
            sendErrors(res, 400, error);
        }
    }
}