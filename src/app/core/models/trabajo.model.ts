import { TrabajoTarea } from "./trabajo-tarea.model";

/**
 * Interfaz que representa un Trabajo
 * Corresponde a la clase Trabajo del backend
 */
export interface Trabajo {
    id?: number; // Opcional para permitir creación sin ID
    descripcionTrabajo: string;
    trabajoTareas?: TrabajoTarea[]; // Opcional ya que puede ir vacío
}
