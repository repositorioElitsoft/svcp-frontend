import { TipoComponente } from "./tipo-componente.model";
import { TipoProducto } from "./tipo-producto.model";

export interface TipoProductoTipoComponente {
    tipoComponente: TipoComponente;
    tipoProducto: TipoProducto;
    cantidad: number;
}

