import { Response, Request, NextFunction } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import sendErrors from '../helpers/sendErrors';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { generarNombreUnico, borrarCarpeta } from '../helpers/functions';
import dateFormat from '../helpers/dateFormat';

export function saveSolicitudDocuments(req: Request, res: Response, next: NextFunction) {
    // crear la fecha para generar la carpeta donde almacenar los archivos
    // la fecha despues se cambia de formato para usarla como fecha de creacion de solicitud
    (req as any).date = dateFormat.getDateFormat('YYYYMMDDHHmmss');

    // crear el metodo para esperar los archivos que vienen en la peticion
    const upload = multer({ fileFilter, storage }).fields([
        { name: 'doc_ide', maxCount: 1 },
        { name: 'doc_rfc', maxCount: 1 },
        { name: 'doc_dom', maxCount: 1 }
    ]);

    // ejecutar el middleware upload
    upload(req, res, async (err: any) => {
        if (err instanceof Error) {
            // si el los middlewares dileUpload o storage arrojan un error
            // se crea el directorio a borrar
            const dir = path.join(__dirname, `../uploads/solicitudes/${(req as any).date}`);
            if (fs.existsSync(dir)) {
                // se elimina el directorio creado si existen error
                borrarCarpeta(dir).then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            }
            if (err instanceof MulterError) {
                return sendErrors(res, 400, `error en la peticion campo ${err.field} no se esperaba`, 'campos para arcivos {doc_ide}, {doc_rfc}, {doc_dom}');
            }
            return sendErrors(res, 500, err.message);
        }
        // se crea un arreglo con el nombre de los field de la peticion
        const fields = Object.entries(req.files).map(([field, [file]]) => {
            return field;
        });
        const errores = validarFileFields(fields);
        if (errores.length > 0) {
            return sendErrors(res, 400, ...errores);
        }
        next();
    });

}

const fileFilter = function (req: any, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1].toLocaleLowerCase();
    const extValidas = ['pdf', 'jpg', 'jpeg'];
    !extValidas.includes(ext) ? cb(new Error(`Error, tipo de archivo no valido, parametro {${file.fieldname}}`)) : cb(null, true);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directorio = path.join(__dirname, `../uploads/solicitudes/${(req as any).date}`);
        (req as any).directorio = directorio;
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }
        cb(null, directorio);
    },
    filename: (req, file, callback) => {
        const nombreUnico = generarNombreUnico(file.originalname);
        callback(null, nombreUnico);
    }
});

const validarFileFields = (fields: string[]): string[] => {
    const errores: string[] = [];
    if (!fields.includes('doc_ide')) errores.push('El campo {doc_ide} es necesario');
    if (!fields.includes('doc_rfc')) errores.push('El campo {doc_rfc} es necesario');
    if (!fields.includes('doc_dom')) errores.push('El campo {doc_dom} es necesario');
    return errores;
}