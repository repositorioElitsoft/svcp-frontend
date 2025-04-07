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

    buscar(trabajoTareaId: number): Observable<ApiEntityResponse<TrabajoTarea>> {
        return this.http.get<ApiEntityResponse<TrabajoTarea>>(`${this.url}trabajos-tareas/${trabajoTareaId}`);
    }

    buscarTodos(trabajoId: number): Observable<ApiEntityResponse<TrabajoTarea[]>> {
        return this.http.get<ApiEntityResponse<TrabajoTarea[]>>(`${this.url}trabajos-tareas/trabajos/${trabajoId}`);
    }

    borrar(trabajoTareaId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}trabajos-tareas/${trabajoTareaId}`);
    }

    borrarTodos(ids: number[]): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}trabajos-tareas/lote`, { headers: this.headers, body: ids });
    }

    actualizar(trabajoTareaId: number, trabajoTarea: TrabajoTarea): Observable<TrabajoTarea> {
        return this.http.put<TrabajoTarea>(`${this.url}trabajos-tareas/${trabajoTareaId}`, trabajoTarea);
    }

    crear(trabajoTarea: TrabajoTarea): Observable<TrabajoTarea> {
        return this.http.post<TrabajoTarea>(`${this.url}trabajos-tareas`, trabajoTarea);
    }

    buscarFiltrado(filtros: { [key: string]: any }): Observable<any> {
        let params = new HttpParams(filtros);
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