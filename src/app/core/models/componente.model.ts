import { EstadoComponente } from "./estado-componente.model";
import { TipoComponente } from "./tipo-componente.model";

export interface Componente {
    id: number;
    fechaCambioEstado: Date;
    codigo: string;
    proveedor: string;
    observacion: string;
    modelo: string;
    tipoComponente: TipoComponente;
    estadoComponente: EstadoComponente;
}

