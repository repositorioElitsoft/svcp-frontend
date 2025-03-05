import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Zona } from '../../core/models/zona.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ZonaService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(zonaId: number): Observable<Zona> {
        return this.http.get<Zona>(`${this.url}zonas/${zonaId}`);
    }

    buscarTodos(): Observable<Zona[]> {
        return this.http.get<Zona[]>(`${this.url}zonas`);
    }

    borrar(zonaId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}zonas/${zonaId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}zonas/lote`, { body: ids });
    }

    actualizar(zonaId: number, zona: Zona): Observable<Zona> {
        return this.http.put<Zona>(`${this.url}zonas/${zonaId}`, zona);
    }

    crear(zona: Zona): Observable<Zona> {
        return this.http.post<Zona>(`${this.url}zonas`, zona);
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
        return this.http.get(`${this.url}core/filter/zonas`, { params, headers: this.headers });
    }
}
