import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TrabajoTarea } from '../models/trabajo-tarea.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TrabajoTareaService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    /**
     * Encuentra un trabajo-tarea por su clave compuesta (trabajoId y tareaId)
     */
    obtener(trabajoId: number, tareaId: number): Observable<ApiEntityResponse<TrabajoTarea>> {
        return this.http.get<ApiEntityResponse<TrabajoTarea>>(`${this.url}trabajos-tareas/${trabajoId}/tarea/${tareaId}`);
    }

    /**
     * Obtiene todos los trabajos-tareas
     */
    obtenerTodos(): Observable<ApiEntityResponse<TrabajoTarea[]>> {
        return this.http.get<ApiEntityResponse<TrabajoTarea[]>>(`${this.url}trabajos-tareas`);
    }

    /**
     * Agrega un nuevo trabajo-tarea
     */
    crear(trabajoTarea: TrabajoTarea): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(`${this.url}trabajos-tareas`, trabajoTarea, { headers: this.headers });
    }

    /**
     * Agrega un lote de trabajos-tareas
     */
    crearLote(trabajoTareas: TrabajoTarea[]): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(`${this.url}trabajos-tareas/lote`, trabajoTareas, { headers: this.headers });
    }

    /**
     * Actualiza un trabajo-tarea existente
     */
    actualizar(trabajoId: number, tareaId: number, trabajoTarea: TrabajoTarea): Observable<ApiEntityResponse<string>> {
        return this.http.put<ApiEntityResponse<string>>(`${this.url}trabajos-tareas/${trabajoId}/tarea/${tareaId}`, trabajoTarea, { headers: this.headers });
    }

    /**
     * Actualiza un lote de trabajos-tareas
     */
    actualizarLote(trabajoTareas: TrabajoTarea[]): Observable<ApiEntityResponse<string>> {
        return this.http.put<ApiEntityResponse<string>>(`${this.url}trabajos-tareas/lote`, trabajoTareas, { headers: this.headers });
    }

    /**
     * Elimina un trabajo-tarea
     */
    borrar(trabajoId: number, tareaId: number): Observable<ApiEntityResponse<string>> {
        return this.http.delete<ApiEntityResponse<string>>(`${this.url}trabajos-tareas/${trabajoId}/tarea/${tareaId}`, { headers: this.headers });
    }

    /**
     * Elimina un lote de trabajos-tareas
     */
    borrarTodo(ids: number[]): Observable<ApiEntityResponse<string>> {
        return this.http.delete<ApiEntityResponse<string>>(`${this.url}trabajos-tareas/lote`, { headers: this.headers, body: ids });
    }

    /**
     * Busca trabajos-tareas con filtros
     */
    buscarFiltrado(filtros: { [key: string]: any }): Observable<any> {
        let params = new HttpParams();
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key)) {
                params = params.append(key, filtros[key]);
            }
        }
        // Hacer la solicitud GET con los parámetros dinámicos
        return this.http.get(`${this.url}core/filter/trabajos-tareas`, { params, headers: this.headers });
    }
} 