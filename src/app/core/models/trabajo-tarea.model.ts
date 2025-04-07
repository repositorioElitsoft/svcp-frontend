import { Tarea } from "./tarea.model";
import { Trabajo } from "./trabajo.model";

export interface TrabajoTarea {
    trabajoId: number;
    tareaId: number;
    ordenEjecucionTarea: number;
    trabajo: Trabajo;
    tarea: Tarea;
}
