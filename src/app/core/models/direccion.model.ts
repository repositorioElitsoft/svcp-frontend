import { Cliente } from "./cliente.model";
import { Estado } from "./estado.model";
import { Sector } from "./sector.model";
import { TipoDireccion } from "./tipo-direccion.model";

export interface Direccion {
    id: number;
    cliente: Cliente;
    descripcionDireccion?: string;
    calle?: string;
    numeracion?: string;
    referencia?: string;
    //omuna: Comuna;
    sector: Sector;
    //contacto: Contacto;
    tipoDireccion: TipoDireccion;
    imagenPerfil?: string;
    latitud?: number;
    longitud?: number;
    estado: Estado;
    flagEvidencia?: string;
}