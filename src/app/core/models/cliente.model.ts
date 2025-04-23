import { AgrupacionComercial } from "./agrupacion-comercial.model";
import { ClasificacionCliente } from "./clasificacion-cliente.model";
import { Direccion } from "./direccion.model";
import { Estado } from "./estados.model";
import { SegmentacionCliente } from "./segmentacion-cliente.model";
import { TipoCliente } from "./tipo-cliente.model";

export interface Cliente {
    id: number;
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    rut: number;
    rutDv: string;
    fechaNacimiento: string;
    imagenPerfil?: string;
    email?: string;
    campo1?: string;
    campo2?: string;
    telefonoFijo?: string;
    telefonoMovil?: string;
    tipoCliente: TipoCliente;
    clasificacionCliente: ClasificacionCliente;
    estado: Estado;
    direcciones: Direccion[];
    agrupacionComercial: AgrupacionComercial;
    segmentacionCliente: SegmentacionCliente;
}

export interface ClienteCrear {
    documentoIdentificacion: any,
    nombre: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    fechaNacimiento: string;
    estado: Estado;
    tipoCliente: any;
    clasificacionCliente: any;
    agrupacionComercial: any;
    segmentacionCliente: any;
}
