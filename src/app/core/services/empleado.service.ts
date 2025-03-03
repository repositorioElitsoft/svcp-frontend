import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Empleado } from '../../core/models/empleado.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class EmpleadoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(empleadoId: number): Observable<Empleado> {
        return this.http.get<Empleado>(`${this.url}empleado/${empleadoId}`);
    }

    buscarTodos(): Observable<Empleado[]> {
        return this.http.get<Empleado[]>(`${this.url}empleado`, { headers: this.headers });
    }

    borrar(empleadoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}empleado/${empleadoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}empleado/lote`, { headers: this.headers, body: ids });
    }

    actualizar(empleadoId: number, empleado: Empleado): Observable<Empleado> {
        return this.http.put<Empleado>(`${this.url}empleado/${empleadoId}`, empleado);
    }

    crear(empleado: Empleado): Observable<Empleado> {
        return this.http.post<Empleado>(`${this.url}empleado`, empleado);
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
        return this.http.get(`${this.url}core/filter/empleado`, { params, headers: this.headers });
    }
}
