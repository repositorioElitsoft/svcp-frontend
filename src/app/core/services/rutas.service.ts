import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEntityResponse } from "../models/api-entity-response.model";
import { Rutas } from "../models/rutas.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class RutaService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(rutaId: number): Observable<ApiEntityResponse<Rutas>> {
        return this.http.get<ApiEntityResponse<Rutas>>(`${this.url}rutas/${rutaId}`);
    }

    buscarTodos(): Observable<ApiEntityResponse<Rutas[]>> {
        return this.http.get<ApiEntityResponse<Rutas[]>>(`${this.url}rutas`);
    }


    borrar(rutaId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}rutas/${rutaId}`);
    }


    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}rutas/lote`, { body: ids });
    }

    actualizar(rutaId: number, ruta: Rutas): Observable<Rutas> {
        return this.http.put<Rutas>(`${this.url}rutas/${rutaId}`, ruta);
    }

    crear(ruta: Rutas): Observable<Rutas> {
        return this.http.post<Rutas>(`${this.url}rutas`, ruta);
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
        return this.http.get(`${this.url}core/filter/rutas`, { params, headers: this.headers });
    }
}
