import { NextFunction, Request, Response } from "express";
import sendErrors from "../helpers/sendErrors";
import { verifyJWTokenHelper } from '../helpers/JWToken';

export async function verificaToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('x-token');
        if (!token) throw new Error('No hay token en la peticion');
        (req as any).usuario = await verifyJWTokenHelper(token);
        next();
    } catch (e) {
        console.log(e);
        sendErrors(res, 400, e);
    }
}