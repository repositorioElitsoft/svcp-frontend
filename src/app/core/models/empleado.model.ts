import { DocumentoIdentificacionError } from "../enums/documento-identificacion.error.enum";
import { DocumentoIdentificacion } from "./documentoIdentificacion.model";

export interface Empleado {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    imagenPerfil: string;
    telefonoFijo: string;
    telefonoMovil: string;
    fechaNacimiento: string;
    email: string;
    rut: number;
    rutDv: string;
    nombreUsuario: string;
    tipoEmpleadoId: number;
    roleId: number;
    estadoId: number;
    documentoIdentificacion: DocumentoIdentificacion

}
