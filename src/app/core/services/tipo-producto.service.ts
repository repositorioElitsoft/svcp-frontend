import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoProducto } from '../../core/models/tipo-producto.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoProductoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoProductoId: number): Observable<ApiEntityResponse<TipoProducto>> {
        return this.http.get<ApiEntityResponse<TipoProducto>>(`${this.url}tipos-productos/${tipoProductoId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<TipoProducto[]>> {
        return this.http.get<ApiEntityResponse<TipoProducto[]>>(`${this.url}tipos-productos`);
    }


    borrar(tipoProductoId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}tipos-productos/${tipoProductoId}`);
    }


    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-productos/lote`);
    }

    actualizar(tipoProductoId: number, tipoProducto: TipoProducto): Observable<TipoProducto> {
        return this.http.put<TipoProducto>(`${this.url}tipos-productos/${tipoProductoId}`, tipoProducto);
    }

    crear(tipoProducto: TipoProducto): Observable<TipoProducto> {
        return this.http.post<TipoProducto>(`${this.url}tipos-productos`, tipoProducto);
    }

    buscarFiltrado(filtros: { [key: string]: any }): Observable<any> {
        console.log("filtros", filtros)
        let params = new HttpParams(filtros);
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key)) {
                params = params.append(key, filtros[key]);
            }
        }
        console.log("params", params)
        // Hacer la solicitud GET con los parámetros dinámicos
        return this.http.get(`${this.url}core/filter/tipos-productos`, { params, headers: this.headers });
    }
}
