// servicio-trabajo.dto.ts

import { Servicio, ServicioDTO } from "./servicio.model";
import { Trabajo, TrabajoDTO } from "./trabajo.model";


export interface ServicioTrabajoDTO {
    servicio: ServicioDTO;
    trabajo: TrabajoDTO;
    secuencia: number;
}

export interface ServicioTrabajo {
    servicio: Servicio;
    trabajo: Trabajo;
    secuencia: number;
}