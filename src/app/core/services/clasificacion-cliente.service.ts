import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ClasificacionCliente } from '../../core/models/clasificacion-cliente.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ClasificacionClienteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(clasificacionClienteId: number): Observable<ClasificacionCliente> {
        return this.http.get<ClasificacionCliente>(`${this.url}clasificacioncliente/${clasificacionClienteId}`);
    }
    buscarTodos(): Observable<ClasificacionCliente[]> {
        return this.http.get<ClasificacionCliente[]>(`${this.url}clasificacioncliente`, { headers: this.headers });
    }
    borrar(clasificacionClienteId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}clasificacioncliente/${clasificacionClienteId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}clasificacioncliente/`, { headers: this.headers, body: ids });
    }

    actualizar(clasificacionClienteId: number, clasificacionCliente: ClasificacionCliente): Observable<ClasificacionCliente> {
        return this.http.put<ClasificacionCliente>(`${this.url}clasificacioncliente/${clasificacionClienteId}`, clasificacionCliente);
    }
    crear(clasificacionCliente: ClasificacionCliente): Observable<ClasificacionCliente> {
        return this.http.post<ClasificacionCliente>(`${this.url}clasificacioncliente`, clasificacionCliente);
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
        return this.http.get(`${this.url}core/filter/clasificacionCliente`, { params });
    }

}