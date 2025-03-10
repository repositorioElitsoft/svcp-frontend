import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoCliente } from '../../core/models/tipo-cliente.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoClienteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoClienteId: number): Observable<ApiEntityResponse<TipoCliente>> {
        return this.http.get<ApiEntityResponse<TipoCliente>>(`${this.url}tipos-clientes/${tipoClienteId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<TipoCliente[]>> {
        return this.http.get<ApiEntityResponse<TipoCliente[]>>(`${this.url}tipos-clientes`, { headers: this.headers });
    }


    borrar(tipoClienteId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}tipos-clientes/${tipoClienteId}`);
    }


    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-clientes/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tipoClienteId: number, tipoCliente: TipoCliente): Observable<TipoCliente> {
        return this.http.put<TipoCliente>(`${this.url}tipos-clientes/${tipoClienteId}`, tipoCliente);
    }

    crear(tipoCliente: TipoCliente): Observable<ApiEntityResponse<TipoCliente>> {
        return this.http.post<ApiEntityResponse<TipoCliente>>(`${this.url}tipos-clientes`, tipoCliente);
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
        return this.http.get(`${this.url}core/filter/tipos-clientes`, { params, headers: this.headers });
    }
}
