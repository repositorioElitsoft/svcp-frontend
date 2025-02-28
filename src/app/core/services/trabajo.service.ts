import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Trabajo } from '../../core/models/trabajo.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TrabajoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(trabajoId: number): Observable<Trabajo> {
        return this.http.get<Trabajo>(`${this.url}trabajo/${trabajoId}`);
    }

    buscarTodos(): Observable<Trabajo[]> {
        return this.http.get<Trabajo[]>(`${this.url}trabajo/lote`, { headers: this.headers });
    }

    borrar(trabajoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}trabajo/${trabajoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}trabajo/lote`, { headers: this.headers, body: ids });
    }

    actualizar(trabajoId: number, trabajo: Trabajo): Observable<Trabajo> {
        return this.http.put<Trabajo>(`${this.url}trabajo/${trabajoId}`, trabajo);
    }

    crear(trabajo: Trabajo): Observable<Trabajo> {
        return this.http.post<Trabajo>(`${this.url}trabajo`, trabajo);
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
        return this.http.get(`${this.url}core/filter/trabajo`, { params, headers: this.headers });
    }
}
