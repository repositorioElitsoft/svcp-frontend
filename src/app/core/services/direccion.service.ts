import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Direccion } from '../../core/models/direccion.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class DireccionService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(direccionId: number): Observable<Direccion> {
        return this.http.get<Direccion>(`${this.url}direcciones/${direccionId}`);
    }

    buscarTodos(): Observable<Direccion[]> {
        return this.http.get<Direccion[]>(`${this.url}direcciones`, { headers: this.headers });
    }

    borrar(direccionId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}direcciones/${direccionId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}direcciones/lote`, { headers: this.headers, body: ids });
    }

    actualizar(direccionId: number, direccion: Direccion): Observable<Direccion> {
        return this.http.put<Direccion>(`${this.url}direcciones/${direccionId}`, direccion);
    }

    crear(direccion: Direccion): Observable<Direccion> {
        return this.http.post<Direccion>(`${this.url}direcciones`, direccion);
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
        return this.http.get(`${this.url}core/filter/direcciones`, { params, headers: this.headers });
    }
}
