import { Estado } from './estado.model';
import { TipoServicio } from './tipo-servicio.model';
import { ServicioTrabajo } from './servicio-trabajo.model';

export interface Servicio {
    id?: number; // Opcional para permitir creación sin ID
    descripcion: string;
    estado: Estado;
    tipoServicio: TipoServicio;
    trabajos?: ServicioTrabajo[];
}


export interface ServicioDTO {
    id: number;
}