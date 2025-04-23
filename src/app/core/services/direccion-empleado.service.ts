import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { DireccionEmpleado } from "../models/direccion-empleado.model";


@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class DireccionEmpleadoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(direccionEmpleadoId: number): Observable<DireccionEmpleado> {
        return this.http.get<DireccionEmpleado>(`${this.url}direcciones-empleados/${direccionEmpleadoId}`);
    }

    buscarTodos(): Observable<DireccionEmpleado[]> {
        return this.http.get<DireccionEmpleado[]>(`${this.url}direcciones-empleados`, { headers: this.headers });
    }

    borrar(direccionEmpleadoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}direcciones-empleados/${direccionEmpleadoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}direcciones-empleados/lote`, { headers: this.headers, body: ids });
    }

    actualizar(direccionEmpleadoId: number, direccionEmpleado: DireccionEmpleado): Observable<DireccionEmpleado> {
        return this.http.put<DireccionEmpleado>(`${this.url}direcciones-empleados/${direccionEmpleadoId}`, direccionEmpleado);
    }

    crear(direccionEmpleado: DireccionEmpleado): Observable<DireccionEmpleado> {
        return this.http.post<DireccionEmpleado>(`${this.url}direcciones-empleados`, direccionEmpleado);
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
        return this.http.get(`${this.url}core/filter/direcciones-empleados`, { params, headers: this.headers });
    }
}
