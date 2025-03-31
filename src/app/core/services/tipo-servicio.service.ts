import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoServicio } from '../../core/models/tipo-servicio.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoServicioService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });


    buscar(tipoServicioId: number): Observable<ApiEntityResponse<TipoServicio>> {
        return this.http.get<ApiEntityResponse<TipoServicio>>(`${this.url}tipos-servicios/${tipoServicioId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<TipoServicio[]>> {
        return this.http.get<ApiEntityResponse<TipoServicio[]>>(`${this.url}tipos-servicios`);
    }


    borrar(tipoServicioId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}tipos-servicios/${tipoServicioId}`);
    }


    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-servicios/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tipoServicioId: number, tipoServicio: TipoServicio): Observable<TipoServicio> {
        return this.http.put<TipoServicio>(`${this.url}tipos-servicios/${tipoServicioId}`, tipoServicio);
    }

    crear(tipoServicio: TipoServicio): Observable<TipoServicio> {
        return this.http.post<TipoServicio>(`${this.url}tipos-servicios`, tipoServicio);
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
        return this.http.get(`${this.url}core/filter/tipos-servicios`, { params, headers: this.headers });
    }
}
