// servicio-trabajo.dto.ts

import { ServicioDTO } from "./servicio.model";
import { TrabajoDTO } from "./trabajo.model";


export interface ServicioTrabajo {
    servicio: ServicioDTO;
    trabajo: TrabajoDTO;
    secuencia: number;
}
