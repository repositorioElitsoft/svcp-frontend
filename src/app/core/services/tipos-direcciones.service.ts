import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TiposDirecciones } from '../../core/models/tipos-direcciones.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TiposDireccionesService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tiposDireccionesId: number): Observable<ApiEntityResponse<TiposDirecciones>> {
        return this.http.get<ApiEntityResponse<TiposDirecciones>>(`${this.url}tipos-direcciones/${tiposDireccionesId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<TiposDirecciones[]>> {
        return this.http.get<ApiEntityResponse<TiposDirecciones[]>>(`${this.url}tipos-direcciones`, { headers: this.headers });
    }

    borrar(tiposDireccionesId: number): Observable<ApiEntityResponse<void>> {
        return this.http.delete<ApiEntityResponse<void>>(`${this.url}tipos-direcciones/${tiposDireccionesId}`);
    }

    borrarTodos(ids: number[]): Observable<ApiEntityResponse<void>> {
        return this.http.delete<ApiEntityResponse<void>>(`${this.url}tipos-direcciones/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tiposDireccionesId: number, tiposDirecciones: TiposDirecciones): Observable<ApiEntityResponse<TiposDirecciones>> {
        return this.http.put<ApiEntityResponse<TiposDirecciones>>(`${this.url}tipos-direcciones/${tiposDireccionesId}`, tiposDirecciones);
    }

    crear(tiposDirecciones: TiposDirecciones): Observable<ApiEntityResponse<TiposDirecciones>> {
        return this.http.post<ApiEntityResponse<TiposDirecciones>>(`${this.url}tipos-direcciones`, tiposDirecciones);
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
        return this.http.get(`${this.url}core/filter/tipos-direcciones`, { params, headers: this.headers });
    }
}
