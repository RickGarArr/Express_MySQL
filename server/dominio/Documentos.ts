import { IDocumentos } from "../interfaces/IDominio";

export default class Documentos implements IDocumentos {
    public id_documentos?: number;
    public doc_identificacion?: string;
    public doc_reg_fed_cont?: string
    public doc_comprobante_domicilio?: string;

    constructor(documento?: IDocumentos) {
        if (documento) {
            this.id_documentos = documento.id_documentos;
            this.doc_identificacion = documento.doc_identificacion;
            this.doc_reg_fed_cont = documento.doc_reg_fed_cont;
            this.doc_comprobante_domicilio = documento.doc_comprobante_domicilio;
        }
    }
}