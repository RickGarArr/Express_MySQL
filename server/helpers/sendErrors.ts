import { Response } from "express";

export default function sendErrors(res: Response, estatus: number, ...errores: string[]) {
    res.status(estatus).json({
        errors: errores
    });
}