import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEntityResponse } from "../models/api-entity-response.model";
import { ServicioTrabajo } from "../models/servicio-trabajo.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ServicioTrabajoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    // GET /servicios-trabajos/{servicioId}/trabajos/{trabajoId}
    buscar(servicioId: number, trabajoId: number): Observable<ApiEntityResponse<ServicioTrabajo>> {
        return this.http.get<ApiEntityResponse<ServicioTrabajo>>(
            `${this.url}servicios-trabajos/${servicioId}/trabajos/${trabajoId}`,
            { headers: this.headers }
        );
    }

    // GET /servicios-trabajos
    buscarTodos(): Observable<ApiEntityResponse<ServicioTrabajo[]>> {
        return this.http.get<ApiEntityResponse<ServicioTrabajo[]>>(
            `${this.url}servicios-trabajos`,
            { headers: this.headers }
        );
    }

    // DELETE /servicios-trabajos/{servicioId}/trabajos/{trabajoId}
    borrar(servicioId: number, trabajoId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(
            `${this.url}servicios-trabajos/${servicioId}/trabajos/${trabajoId}`,
            { headers: this.headers }
        );
    }

    // DELETE /servicios-trabajos/lote
    borrarLote(serviciosTrabajos: ServicioTrabajo[]): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(
            `${this.url}servicios-trabajos/lote`,
            {
                headers: this.headers,
                body: serviciosTrabajos
            }
        );
    }

    // PUT /servicios-trabajos/{servicioId}/trabajos/{trabajoId}
    actualizar(servicioId: number, trabajoId: number, servicioTrabajo: ServicioTrabajo): Observable<ApiEntityResponse<any>> {
        return this.http.put<ApiEntityResponse<any>>(
            `${this.url}servicios-trabajos/${servicioId}/trabajos/${trabajoId}`,
            servicioTrabajo,
            { headers: this.headers }
        );
    }

    // PUT /servicios-trabajos/lote
    actualizarLote(serviciosTrabajos: ServicioTrabajo[]): Observable<ApiEntityResponse<any>> {
        return this.http.put<ApiEntityResponse<any>>(
            `${this.url}servicios-trabajos/lote`,
            serviciosTrabajos,
            { headers: this.headers }
        );
    }

    // POST /servicios-trabajos
    crear(servicioTrabajo: ServicioTrabajo): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(
            `${this.url}servicios-trabajos`,
            servicioTrabajo,
            { headers: this.headers }
        );
    }

    // POST /servicios-trabajos/lote
    crearLote(serviciosTrabajos: ServicioTrabajo[]): Observable<ApiEntityResponse<any>> {
        return this.http.post<ApiEntityResponse<any>>(
            `${this.url}servicios-trabajos/lote`,
            serviciosTrabajos,
            { headers: this.headers }
        );
    }

    // GET /core/filter/servicios-trabajos
    buscarFiltrado(filtros: { [key: string]: any }): Observable<ApiEntityResponse<ServicioTrabajo[]>> {
        let params = new HttpParams();
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key)) {
                params = params.append(key, filtros[key]);
            }
        }
        return this.http.get<ApiEntityResponse<ServicioTrabajo[]>>(
            `${this.url}core/filter/servicios-trabajos`,
            { params, headers: this.headers }
        );
    }
} 