import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Comuna } from "../models/comuna.models";



@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ComunaService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(comunaId: number): Observable<Comuna> {
        return this.http.get<Comuna>(`${this.url}comunas/${comunaId}`);
    }

    buscarTodos(): Observable<Comuna[]> {
        return this.http.get<Comuna[]>(`${this.url}comunas`
        );
    }

    borrar(comunaId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}comunas/${comunaId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}comunas/lote`, { body: ids });
    }

    actualizar(comunaId: number, comuna: Comuna): Observable<Comuna> {
        return this.http.put<Comuna>(`${this.url}comunas/${comunaId}`, comuna);
    }

    crear(comuna: Comuna): Observable<Comuna> {
        return this.http.post<Comuna>(`${this.url}comunas`, comuna);
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
        return this.http.get(`${this.url}core/filter/comunas`, { params });
    }
}
