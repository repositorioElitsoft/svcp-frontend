import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Estado } from '../models/estados.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class EstadoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(estadoId: number): Observable<Estado> {
        return this.http.get<Estado>(`${this.url}estados/${estadoId}`);
    }

    buscarTodos(): Observable<Estado[]> {
        return this.http.get<Estado[]>(`${this.url}estados`, { headers: this.headers });
    }

    borrar(estadoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}estados/${estadoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}estados/lote`, { headers: this.headers, body: ids });
    }

    actualizar(estadoId: number, estado: Estado): Observable<Estado> {
        return this.http.put<Estado>(`${this.url}estados/${estadoId}`, estado);
    }

    crear(estado: Estado): Observable<Estado> {
        return this.http.post<Estado>(`${this.url}estados`, estado);
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
        return this.http.get(`${this.url}core/filter/estados`, { params, headers: this.headers });
    }
}
