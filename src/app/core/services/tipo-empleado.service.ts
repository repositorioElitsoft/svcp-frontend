import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoEmpleado } from '../../core/models/tipo-empleado.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoEmpleadoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoEmpleadoId: number): Observable<TipoEmpleado> {
        return this.http.get<TipoEmpleado>(`${this.url}tipos-empleados/${tipoEmpleadoId}`);
    }

    buscarTodos(): Observable<TipoEmpleado[]> {
        return this.http.get<TipoEmpleado[]>(`${this.url}tipos-empleados`, { headers: this.headers });
    }

    borrar(tipoEmpleadoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-empleados/${tipoEmpleadoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-empleados/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tipoEmpleadoId: number, tipoEmpleado: TipoEmpleado): Observable<TipoEmpleado> {
        return this.http.put<TipoEmpleado>(`${this.url}tipos-empleados/${tipoEmpleadoId}`, tipoEmpleado);
    }

    crear(tipoEmpleado: TipoEmpleado): Observable<TipoEmpleado> {
        return this.http.post<TipoEmpleado>(`${this.url}tipos-empleados`, tipoEmpleado);
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
        return this.http.get(`${this.url}core/filter/tipos-empleados`, { params, headers: this.headers });
    }
}
