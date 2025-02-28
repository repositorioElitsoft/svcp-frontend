import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { SegmentacionCliente } from '../../core/models/segmentacion-cliente.model';

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

    buscar(segmentacionClienteId: number): Observable<SegmentacionCliente> {
        return this.http.get<SegmentacionCliente>(`${this.url}segmentacioncliente/${segmentacionClienteId}`);
    }

    buscarTodos(): Observable<SegmentacionCliente[]> {
        return this.http.get<SegmentacionCliente[]>(`${this.url}segmentacioncliente/lote`, { headers: this.headers });
    }

    borrar(segmentacionClienteId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}segmentacioncliente/${segmentacionClienteId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}segmentacioncliente/lote`, { headers: this.headers, body: ids });
    }

    actualizar(segmentacionClienteId: number, segmentacionCliente: SegmentacionCliente): Observable<SegmentacionCliente> {
        return this.http.put<SegmentacionCliente>(`${this.url}segmentacioncliente/${segmentacionClienteId}`, segmentacionCliente);
    }

    crear(segmentacionCliente: SegmentacionCliente): Observable<SegmentacionCliente> {
        return this.http.post<SegmentacionCliente>(`${this.url}segmentacioncliente`, segmentacionCliente);
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
        return this.http.get(`${this.url}core/filter/segmentacioncliente`, { params, headers: this.headers });
    }
}
