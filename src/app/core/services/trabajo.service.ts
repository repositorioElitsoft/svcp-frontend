import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Trabajo } from '../../core/models/trabajo.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";
import { PagedResponse } from "../models/paged-content.models";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TrabajoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    // GET /trabajos/{id}
    buscar(trabajoId: number): Observable<ApiEntityResponse<Trabajo>> {
        return this.http.get<ApiEntityResponse<Trabajo>>(`${this.url}trabajos/${trabajoId}`);
    }

    // GET /trabajos
    buscarTodos(): Observable<ApiEntityResponse<Trabajo[]>> {
        return this.http.get<ApiEntityResponse<Trabajo[]>>(`${this.url}trabajos`);
    }

    // DELETE /trabajos/{id}
    borrar(trabajoId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}trabajos/${trabajoId}`);
    }

    // DELETE /trabajos/lote
    borrarLote(ids: number[]): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}trabajos/lote`, { body: ids });
    }

    // PUT /trabajos/{id}
    actualizar(trabajoId: number, trabajo: Trabajo): Observable<ApiEntityResponse<any>> {
        return this.http.put<ApiEntityResponse<any>>(`${this.url}trabajos/${trabajoId}`, trabajo);
    }

    // PUT /trabajos/lote
    actualizarLote(trabajos: Trabajo[]): Observable<ApiEntityResponse<any>> {
        return this.http.put<ApiEntityResponse<any>>(`${this.url}trabajos/lote`, trabajos);
    }

    // POST /trabajos
    crear(trabajo: Trabajo): Observable<ApiEntityResponse<Trabajo>> {
        return this.http.post<ApiEntityResponse<Trabajo>>(`${this.url}trabajos`, trabajo);
    }

    // POST /trabajos/lote
    crearLote(trabajos: Trabajo[]): Observable<ApiEntityResponse<any>> {
        return this.http.post<ApiEntityResponse<any>>(`${this.url}trabajos/lote`, trabajos);
    }

    // GET /core/filter/trabajos
    buscarFiltrado(filtros: { [key: string]: any }): Observable<ApiEntityResponse<Trabajo[]>> {
        let params = new HttpParams();
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key)) {
                params = params.append(key, filtros[key]);
            }
        }
        return this.http.get<ApiEntityResponse<Trabajo[]>>(`${this.url}core/filter/trabajos`, { params, headers: this.headers });
    }



    // GET /core/filter/servicios-trabajos-asignados
    buscarFiltradoAsignacion(filtros: { [key: string]: any }): Observable<PagedResponse<Trabajo>> {
        let params = new HttpParams();
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key) && filtros[key] !== undefined && filtros[key] !== null && filtros[key] !== '') {
                params = params.append(key, filtros[key].toString());
            }
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.get<PagedResponse<Trabajo>>(`${this.url}core/filter/trabajos-tareas-asignados`, {
            params,
            headers: headers
        });
    }
}
