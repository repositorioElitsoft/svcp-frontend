import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoProducto } from '../../core/models/tipo-producto.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoProductoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoProductoId: number): Observable<TipoProducto> {
        return this.http.get<TipoProducto>(`${this.url}tipoproducto/${tipoProductoId}`);
    }

    buscarTodos(): Observable<TipoProducto[]> {
        return this.http.get<TipoProducto[]>(`${this.url}tipoproducto`, { headers: this.headers });
    }

    borrar(tipoProductoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tipoproducto/${tipoProductoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipoproducto/`, { headers: this.headers, body: ids });
    }

    actualizar(tipoProductoId: number, tipoProducto: TipoProducto): Observable<TipoProducto> {
        return this.http.put<TipoProducto>(`${this.url}tipoproducto/${tipoProductoId}`, tipoProducto);
    }

    crear(tipoProducto: TipoProducto): Observable<TipoProducto> {
        return this.http.post<TipoProducto>(`${this.url}tipoproducto`, tipoProducto);
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
        return this.http.get(`${this.url}core/filter/tipoproducto`, { params, headers: this.headers });
    }
}
