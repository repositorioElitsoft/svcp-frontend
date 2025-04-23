import { TipoProductoTipoComponente } from "./tipo-producto-tipo.componente.model";

export interface TipoProducto {
    id: number;
    descripcionTipoProducto: string;
    tipoProductoTipoComponentes?: TipoProductoTipoComponente[];
}
