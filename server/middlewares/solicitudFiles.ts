import { Response, Request, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sendErrors from '../helpers/sendErrors';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { generarNombreUnico, borrarCarpeta } from '../helpers/functions';

export function saveDocuments(req: Request, res: Response, next: NextFunction) {

    (req as any).date = moment().format('YYYYMMDDHHmmss');

    const upload = multer({ fileFilter, storage }).fields([
        { name: 'doc_ine', maxCount: 1 },
        { name: 'doc_rfc', maxCount: 1 },
        { name: 'doc_dom', maxCount: 1 }
    ]);

    upload(req, res, async (err: any) => {

        if (err instanceof Error) {
            try {
                const dir = path.join(__dirname, `../uploads/solicitudes/${(req as any).date}`);
                if (fs.existsSync(dir)) {
                    await borrarCarpeta(dir);
                }
            } catch (error) {
                console.log(error);
            }
            return sendErrors(res, 500, err.message);
        }

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
    if (!fields.includes('doc_ine')) errores.push('El campo {doc_ine} es necesario');
    if (!fields.includes('doc_rfc')) errores.push('El campo {doc_rfc} es necesario');
    if (!fields.includes('doc_dom')) errores.push('El campo {doc_dom} es necesario');
    return errores;
}