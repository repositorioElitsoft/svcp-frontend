import { Comuna } from "./comuna.models";
import { Empleado } from "./empleado.model";
import { Estado } from "./estados.model";

export interface DireccionEmpleado {
    id: number;
    estado: Estado;
    comuna: Comuna;
    calle: string;
    numeracion: string;
    latitud: number;
    longitud: number;
    descripcion: string;
    referencia: string;
    empleado: Empleado;
}
