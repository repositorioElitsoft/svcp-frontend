import { TipoDocumentoIdentificacion } from "./tipo-documento-identificacion.model";

export interface DocumentoIdentificacion {

    id: number;
    numero: string;
    digitoVerificador: string;
    tipoDocumentoIdentificacion: TipoDocumentoIdentificacion

}