import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoCliente } from '../../core/models/tipo-cliente.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoClienteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoClienteId: number): Observable<TipoCliente> {
        return this.http.get<TipoCliente>(`${this.url}tipocliente/${tipoClienteId}`);
    }

    buscarTodos(): Observable<TipoCliente[]> {
        return this.http.get<TipoCliente[]>(`${this.url}tipocliente`, { headers: this.headers });
    }

    borrar(tipoClienteId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tipocliente/${tipoClienteId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipocliente/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tipoClienteId: number, tipoCliente: TipoCliente): Observable<TipoCliente> {
        return this.http.put<TipoCliente>(`${this.url}tipocliente/${tipoClienteId}`, tipoCliente);
    }

    crear(tipoCliente: TipoCliente): Observable<TipoCliente> {
        return this.http.post<TipoCliente>(`${this.url}tipocliente`, tipoCliente);
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
        return this.http.get(`${this.url}core/filter/tipocliente`, { params, headers: this.headers });
    }
}
