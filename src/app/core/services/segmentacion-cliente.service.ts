import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { SegmentacionCliente } from '../../core/models/segmentacion-cliente.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class SegmentacionClienteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(segmentacionClienteId: number): Observable<ApiEntityResponse<SegmentacionCliente>> {
        return this.http.get<ApiEntityResponse<SegmentacionCliente>>(`${this.url}segmentaciones-clientes/${segmentacionClienteId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<SegmentacionCliente[]>> {
        return this.http.get<ApiEntityResponse<SegmentacionCliente[]>>(`${this.url}segmentaciones-clientes`, { headers: this.headers });
    }

    borrar(segmentacionClienteId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}segmentaciones-clientes/${segmentacionClienteId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}segmentaciones-clientes/lote`, { body: ids });
    }

    actualizar(segmentacionClienteId: number, segmentacionCliente: SegmentacionCliente): Observable<SegmentacionCliente> {
        return this.http.put<SegmentacionCliente>(`${this.url}segmentaciones-clientes/${segmentacionClienteId}`, segmentacionCliente);
    }

    crear(segmentacionCliente: SegmentacionCliente): Observable<SegmentacionCliente> {
        return this.http.post<SegmentacionCliente>(`${this.url}segmentaciones-clientes`, segmentacionCliente);
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
        return this.http.get(`${this.url}core/filter/segmentaciones-clientes`, { params, headers: this.headers });
    }
}
