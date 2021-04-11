import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import sendErrors from '../helpers/sendErrors';

export default function validarCampos (req: Request, res: Response, next: NextFunction) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const errors = errores.array().map( error => {
            return error.msg;
        });
        return sendErrors(res, 400, ...errors);
    }
    next();
}