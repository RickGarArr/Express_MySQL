import { IUsuario } from "../interfaces/IDominio";

export default class Usuario implements IUsuario {
    
    id_usuario: number;
    email: string;
    telefono: string;
    password: string;
    fecha_creacion: string;
    tipo: string;

    constructor(email: string, telefono: string, password: string, fecha_creacion: string, tipo: string, id_usuario?: number) {
        this.id_usuario = id_usuario || 0;
        this.email = email;
        this.telefono = telefono;
        this.password = password;
        this.fecha_creacion = fecha_creacion;
        this.tipo = tipo;
    }
}