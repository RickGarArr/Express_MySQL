import { Response, Request } from 'express';
import Documentos from '../models/Documentos';
import moment from 'moment';
import Solicitud from '../models/Solicitud';
import SolicitudAccess from '../access/solicitud.access';
import { borrarCarpeta } from '../helpers/functions';
import sendErrors from '../helpers/sendErrors';
import SolicitudProcedures from '../access/procedures/solicitud.procedures';
import dateFormat from '../helpers/dateFormat';

export default class SolicitudCtrl {
    public static async create(req: Request, res: Response) {
        // obtener la fecha de creacion generada en el middleware solicitudFile
        const fecha_creacion = dateFormat.getDateFromFormat((req as any).date, 'YYYYMDDHHmmss') .format('YYYY-MM-DD HH:mm:ss');
        // crear el objeto solicitud
        const { nombre, email, telefono } = req.body;
        const solicitud = new Solicitud({ email, telefono, nombre, fecha_creacion });
        // crear el objeto documentos
        const documentos = new Documentos();
        // llenar las propiedades de documentos
        Object.entries(req.files).forEach(([field, [file]]) => {
            if (field === 'doc_ide') documentos.doc_identificacion = (file as Express.Multer.File).filename;
            if (field === 'doc_rfc') documentos.doc_reg_fed_cont = (file as Express.Multer.File).filename;
            if (field === 'doc_dom') documentos.doc_comprobante_domicilio = (file as Express.Multer.File).filename;
        });
        const solicitudProcedures = new SolicitudProcedures();
        try {
            const result = await solicitudProcedures.createSolicitud(documentos, solicitud);
            res.json({
                ok: true,
                result
            });
        } catch (error) {
            await borrarCarpeta((req as any).directorio);
            sendErrors(res, 400, error);
        }
    }
}