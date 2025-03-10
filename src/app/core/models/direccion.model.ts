import { Cliente } from "./cliente.model";
import { Comuna } from "./comuna.models";
import { Contacto } from "./contacto.model";
import { Estado } from "./estados.model";
import { Sector } from "./sector.model";
import { TiposDirecciones } from "./tipos-direcciones.model";

export interface Direccion {
    id: number;
    cliente: Cliente;
    descripcionDireccion?: string;
    calle?: string;
    numeracion?: string;
    referencia?: string;
    comuna: Comuna;
    sector: Sector;
    contacto: Contacto;
    tipoDireccion: TiposDirecciones;
    imagenPerfil?: string;
    latitud?: number;
    longitud?: number;
    estado: Estado;
    flagEvidencia?: string;
}