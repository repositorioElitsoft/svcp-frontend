import { Estado } from './estado.model';
import { TipoServicio } from './tipo-servicio.model';

export interface Servicio {
    id?: number; // Opcional para permitir creación sin ID
    descripcion: string;
    estado: Estado;
    tipoServicio: TipoServicio;
}


export interface ServicioDTO {
    id: number;
}