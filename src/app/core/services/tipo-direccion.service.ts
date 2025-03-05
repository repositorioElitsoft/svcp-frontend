import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoDireccion } from "../models/tipo-direccion.model";


@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoDireccionService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoDireccionId: number): Observable<TipoDireccion> {
        return this.http.get<TipoDireccion>(`${this.url}tipos-direcciones/${tipoDireccionId}`);
    }

    buscarTodos(): Observable<TipoDireccion[]> {
        return this.http.get<TipoDireccion[]>(`${this.url}tipos-direcciones`
        );
    }

    borrar(tipoDireccionId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-direcciones/${tipoDireccionId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-direcciones/lote`, { body: ids });
    }

    actualizar(tipoDireccionId: number, tipoDireccion: TipoDireccion): Observable<TipoDireccion> {
        return this.http.put<TipoDireccion>(`${this.url}tipos-direcciones/${tipoDireccionId}`, tipoDireccion);
    }

    crear(tipoDireccion: TipoDireccion): Observable<TipoDireccion> {
        return this.http.post<TipoDireccion>(`${this.url}tipos-direcciones`, tipoDireccion);
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
        return this.http.get(`${this.url}core/filter/tipos-direcciones`, { params });
    }
}
