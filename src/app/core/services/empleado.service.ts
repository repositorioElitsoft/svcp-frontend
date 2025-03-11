import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Empleado } from '../../core/models/empleado.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

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

    buscar(empleadoId: number): Observable<ApiEntityResponse<Empleado>> {
        return this.http.get<ApiEntityResponse<Empleado>>(`${this.url}empleados/${empleadoId}`);
    }

    buscarTodos(): Observable<Empleado[]> {
        return this.http.get<Empleado[]>(`${this.url}empleados`, { headers: this.headers });
    }

    borrar(empleadoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}empleados/${empleadoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}empleados/lote`, { headers: this.headers, body: ids });
    }

    actualizar(empleadoId: number, empleado: Empleado): Observable<Empleado> {
        return this.http.put<Empleado>(`${this.url}empleados/${empleadoId}`, empleado);
    }

    crear(empleado: Empleado): Observable<Empleado> {
        return this.http.post<Empleado>(`${this.url}empleados`, empleado);
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
        return this.http.get(`${this.url}core/filter/empleados`, { params, headers: this.headers });
    }
}
