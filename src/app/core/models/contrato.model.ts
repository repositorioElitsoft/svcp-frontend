import { Cliente } from "./cliente.model";
import { Contacto } from "./contacto.model";
import { Estado } from "./estados.model";

export interface Contrato {
    id: number;
    cliente: Cliente;
    fechaCreacion: string;
    fechaInicio: string;
    fechaFin: string;
    contacto: Contacto;
    estado: Estado;
}