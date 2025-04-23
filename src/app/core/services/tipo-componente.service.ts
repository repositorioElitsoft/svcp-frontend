import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEntityResponse } from "../models/api-entity-response.model";
import { TipoComponente } from "../models/tipo-componente.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoComponenteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });


    buscar(tipoComponenteId: number): Observable<ApiEntityResponse<TipoComponente>> {
        return this.http.get<ApiEntityResponse<TipoComponente>>(`${this.url}tipos-componentes/${tipoComponenteId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<TipoComponente[]>> {
        return this.http.get<ApiEntityResponse<TipoComponente[]>>(`${this.url}tipos-componentes`);
    }


    borrar(tipoComponenteId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}tipos-componentes/${tipoComponenteId}`);
    }


    borrarTodos(tipoComponentes: TipoComponente[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-componentes/lote`, { body: tipoComponentes });
    }

    actualizar(tipoComponenteId: number, tipoComponente: TipoComponente): Observable<TipoComponente> {
        return this.http.put<TipoComponente>(`${this.url}tipos-componentes/${tipoComponenteId}`, tipoComponente);
    }

    crear(tipoComponente: TipoComponente): Observable<TipoComponente> {
        return this.http.post<TipoComponente>(`${this.url}tipos-componentes`, tipoComponente);
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
        return this.http.get(`${this.url}core/filter/tipos-componentes`, { params, headers: this.headers });
    }
}
