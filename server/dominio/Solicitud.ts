import { ISolicitud } from "../interfaces/IDominio";

export default class Solicitud implements ISolicitud {

    public id_solicitud?: number;
    public nombre?: string;
    public email?: string;
    public telefono?: string;
    public id_documentos?: number;
    public estado?: string;
    public fecha_creacion?: string;

    constructor(solicitud?: ISolicitud) {
        if (solicitud) {
            this.id_solicitud = solicitud.id_solicitud;
            this.nombre = solicitud.nombre;
            this.email = solicitud.email;
            this.telefono = solicitud.telefono;
            this.id_documentos = solicitud.id_documentos;
            this.estado = solicitud.estado;
            this.fecha_creacion = solicitud.fecha_creacion;
        }
    }
}