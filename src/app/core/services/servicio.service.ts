import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Servicio } from '../models/servicio.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";
import { PagedResponse } from "../models/paged-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ServicioService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    // GET /servicios/{id}
    buscar(servicioId: number): Observable<ApiEntityResponse<Servicio>> {
        return this.http.get<ApiEntityResponse<Servicio>>(`${this.url}servicios/${servicioId}`, { headers: this.headers });
    }

    // GET /servicios
    buscarTodos(): Observable<ApiEntityResponse<Servicio[]>> {
        return this.http.get<ApiEntityResponse<Servicio[]>>(`${this.url}servicios`, { headers: this.headers });
    }

    // DELETE /servicios/{id}
    borrar(servicioId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}servicios/${servicioId}`, { headers: this.headers });
    }

    // DELETE /servicios/lote
    borrarLote(servicios: Servicio[]): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}servicios/lote`, {
            headers: this.headers,
            body: servicios
        });
    }

    // PUT /servicios/{id}
    actualizar(servicioId: number, servicio: Servicio): Observable<ApiEntityResponse<any>> {
        return this.http.put<ApiEntityResponse<any>>(`${this.url}servicios/${servicioId}`, servicio, { headers: this.headers });
    }

    // PUT /servicios/lote
    actualizarLote(servicios: Servicio[]): Observable<ApiEntityResponse<any>> {
        return this.http.put<ApiEntityResponse<any>>(`${this.url}servicios/lote`, servicios, { headers: this.headers });
    }

    // POST /servicios
    crear(servicio: Servicio): Observable<ApiEntityResponse<Servicio>> {
        return this.http.post<ApiEntityResponse<Servicio>>(`${this.url}servicios`, servicio, { headers: this.headers });
    }

    // POST /servicios/lote
    crearLote(servicios: Servicio[]): Observable<ApiEntityResponse<any>> {
        return this.http.post<ApiEntityResponse<any>>(`${this.url}servicios/lote`, servicios, { headers: this.headers });
    }

    // GET /core/filter/servicios
    buscarFiltrado(filtros: { [key: string]: any }): Observable<PagedResponse<Servicio>> {
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

        return this.http.get<PagedResponse<Servicio>>(`${this.url}core/filter/servicios`, {
            params,
            headers: headers
        });
    }

    // GET /core/filter/servicios-trabajos-asignados
    buscarFiltradoAsignacion(filtros: { [key: string]: any }): Observable<PagedResponse<Servicio>> {
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

        return this.http.get<PagedResponse<Servicio>>(`${this.url}core/filter/servicios-trabajos-asignados`, {
            params,
            headers: headers
        });
    }
} 