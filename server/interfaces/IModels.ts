export interface IUsuario {
    id_usuario?: number;
    email?: string;
    telefono?: string;
    password?: string;
    fecha_creacion?: string;
    tipo?: string;
}

export interface ISolicitud {
    id_solicitud?: number;
    nombre?: string;
    email?: string;
    telefono?: string;
    id_documentos?: number;
    estado?: string;
    fecha_creacion?: string;
}

export interface IDocumentos {
    id_documentos?: number;
    doc_identificacion?: string;
    doc_reg_fed_cont?: string
    doc_comprobante_domicilio?: string;
}