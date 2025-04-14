import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEntityResponse } from "../models/api-entity-response.model";
import { TipoProductoTipoComponente } from "../models/tipo-producto-tipo.componente.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoProductoTipoComponenteService {
    readonly url = `${environment.apiUrl}tipos-productos-tipos-componentes`;
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    /**
     * Encuentra un tipo-producto-tipo-componente por su clave compuesta
     */
    obtener(tipoProductoId: number, tipoComponenteId: number): Observable<ApiEntityResponse<TipoProductoTipoComponente>> {
        return this.http.get<ApiEntityResponse<TipoProductoTipoComponente>>(
            `${this.url}/${tipoProductoId}/${tipoComponenteId}`,
            { headers: this.headers }
        );
    }

    /**
     * Obtiene todos los tipos-productos-tipos-componentes
     */
    obtenerTodos(): Observable<ApiEntityResponse<TipoProductoTipoComponente[]>> {
        return this.http.get<ApiEntityResponse<TipoProductoTipoComponente[]>>(
            `${this.url}`,
            { headers: this.headers }
        );
    }

    /**
     * Agrega un nuevo tipo-producto-tipo-componente
     */
    crear(tipoProductoTipoComponente: TipoProductoTipoComponente): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(
            `${this.url}`,
            tipoProductoTipoComponente,
            { headers: this.headers }
        );
    }

    /**
     * Agrega un lote de tipos-productos-tipos-componentes
     */
    crearLote(tipoProductoTipoComponentes: TipoProductoTipoComponente[]): Observable<ApiEntityResponse<string>> {
        return this.http.post<ApiEntityResponse<string>>(
            `${this.url}/lote`,
            tipoProductoTipoComponentes,
            { headers: this.headers }
        );
    }

    /**
     * Actualiza un tipo-producto-tipo-componente existente
     */
    actualizar(tipoProductoId: number, tipoComponenteId: number, tipoProductoTipoComponente: TipoProductoTipoComponente): Observable<ApiEntityResponse<string>> {
        return this.http.put<ApiEntityResponse<string>>(
            `${this.url}/${tipoProductoId}/${tipoComponenteId}`,
            tipoProductoTipoComponente,
            { headers: this.headers }
        );
    }

    /**
     * Actualiza un lote de tipos-productos-tipos-componentes
     */
    actualizarLote(tipoProductoTipoComponentes: TipoProductoTipoComponente[]): Observable<ApiEntityResponse<string>> {
        return this.http.put<ApiEntityResponse<string>>(
            `${this.url}/lote`,
            tipoProductoTipoComponentes,
            { headers: this.headers }
        );
    }

    /**
     * Elimina un tipo-producto-tipo-componente
     */
    borrar(tipoProductoId: number, tipoComponenteId: number): Observable<ApiEntityResponse<string>> {
        return this.http.delete<ApiEntityResponse<string>>(
            `${this.url}/${tipoProductoId}/${tipoComponenteId}`,
            { headers: this.headers }
        );
    }

    /**
     * Elimina un lote de tipos-productos-tipos-componentes
     */
    borrarLote(tipoProductoTipoComponentes: TipoProductoTipoComponente[]): Observable<ApiEntityResponse<string>> {
        return this.http.delete<ApiEntityResponse<string>>(
            `${this.url}/lote`,
            {
                headers: this.headers,
                body: tipoProductoTipoComponentes
            }
        );
    }

    /**
     * Busca tipos-productos-tipos-componentes con filtros
     */
    buscarFiltrado(filtros: { [key: string]: any }): Observable<any> {
        let params = new HttpParams();
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key)) {
                params = params.append(key, filtros[key]);
            }
        }
        return this.http.get(`${this.url}`, { params, headers: this.headers });
    }
} 