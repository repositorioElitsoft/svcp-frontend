import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoServicio } from '../../core/models/tipo-servicio.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoServicioService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoServicioId: number): Observable<TipoServicio> {
        return this.http.get<TipoServicio>(`${this.url}tiposervicio/${tipoServicioId}`);
    }

    buscarTodos(): Observable<TipoServicio[]> {
        return this.http.get<TipoServicio[]>(`${this.url}tiposervicio`, { headers: this.headers });
    }

    borrar(tipoServicioId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tiposervicio/${tipoServicioId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tiposervicio/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tipoServicioId: number, tipoServicio: TipoServicio): Observable<TipoServicio> {
        return this.http.put<TipoServicio>(`${this.url}tiposervicio/${tipoServicioId}`, tipoServicio);
    }

    crear(tipoServicio: TipoServicio): Observable<TipoServicio> {
        return this.http.post<TipoServicio>(`${this.url}tiposervicio`, tipoServicio);
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
        return this.http.get(`${this.url}core/filter/tiposervicio`, { params, headers: this.headers });
    }
}
