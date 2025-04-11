import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TrabajoTarea } from '../models/trabajo-tarea.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

export interface TrabajoTareaDTO {
    trabajoId: number;
    tareaId: number;
    ordenEjecucionTarea: number;
}

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TrabajoTareaService {
    readonly url = `${environment.apiUrl}trabajos-tareas`;
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    /**
     * Encuentra un trabajo-tarea por su clave compuesta (trabajoId y tareaId)
     */
    obtener(trabajoId: number, tareaId: number): Observable<ApiEntityResponse<TrabajoTarea>> {
        return this.http.get<ApiEntityResponse<TrabajoTarea>>(`${this.url}/${trabajoId}/tarea/${tareaId}`, { headers: this.headers });
    }

    /**
     * Obtiene todos los trabajos-tareas
     */
    obtenerTodos(): Observable<ApiEntityResponse<TrabajoTarea[]>> {
        return this.http.get<ApiEntityResponse<TrabajoTarea[]>>(`${this.url}`, { headers: this.headers });
    }

    /**
     * Agrega un nuevo trabajo-tarea
     */
    crear(trabajoTarea: TrabajoTarea): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(`${this.url}`, trabajoTarea, { headers: this.headers });
    }

    /**
     * Agrega un lote de trabajos-tareas
     */
    crearLote(trabajoTareas: TrabajoTareaDTO[]): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(`${this.url}/lote`, trabajoTareas, {
            headers: this.headers
        });
    }

    /**
     * Actualiza un trabajo-tarea existente
     */
    actualizar(trabajoId: number, tareaId: number, trabajoTarea: TrabajoTarea): Observable<ApiEntityResponse<string>> {
        return this.http.put<ApiEntityResponse<string>>(`${this.url}/${trabajoId}/tarea/${tareaId}`, trabajoTarea, { headers: this.headers });
    }

    /**
     * Actualiza un lote de trabajos-tareas
     */
    actualizarLote(trabajoTareas: TrabajoTareaDTO[]): Observable<ApiEntityResponse<string>> {
        console.log('=== SERVICIO - ACTUALIZAR LOTE ===');
        console.log('URL:', `${this.url}/lote`);
        console.log('Datos:', trabajoTareas);

        return this.http.put<ApiEntityResponse<string>>(`${this.url}/lote`, trabajoTareas, {
            headers: this.headers
        });
    }

    /**
     * Elimina un trabajo-tarea
     */
    borrar(trabajoId: number, tareaId: number): Observable<ApiEntityResponse<string>> {
        return this.http.delete<ApiEntityResponse<string>>(`${this.url}/${trabajoId}/tarea/${tareaId}`, { headers: this.headers });
    }

    /**
     * Elimina un lote de trabajos-tareas
     */
    borrarTodo(trabajoTareas: any[]): Observable<ApiEntityResponse<string>> {
        const formattedData = trabajoTareas.map(tt => ({
            trabajoId: tt.trabajo?.id || tt.trabajoId,
            tareaId: tt.tarea?.id || tt.tareaId
        }));

        return this.http.delete<ApiEntityResponse<string>>(`${this.url}/lote`, {
            headers: this.headers,
            body: formattedData
        });
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
        return this.http.get(`${this.url}`, { params, headers: this.headers });
    }
} 