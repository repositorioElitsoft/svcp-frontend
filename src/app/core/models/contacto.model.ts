import { Cliente } from "./cliente.model";
import { DocumentoIdentificacion } from "./documentoIdentificacion.model";
import { Direccion } from "./direccion.model";

export interface Contacto {
    id?: number;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    fechaNacimiento?: string;
    imagenPerfil?: string;
    correoElectronico?: string;
    telefonoFijo?: number;
    telefonoMovil?: number;
    documentoIdentificacion?: DocumentoIdentificacion;
    cliente?: Cliente;
    contactoDireccion?: ContactoDireccion[];
}

export interface ContactoDireccion {
    id: number;
    contacto: Contacto;
    direccion: Direccion;
    principal: boolean;
}
