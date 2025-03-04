import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tarea } from '../../core/models/tarea.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TareaService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tareaId: number): Observable<Tarea> {
        return this.http.get<Tarea>(`${this.url}tareas/${tareaId}`);
    }

    buscarTodos(): Observable<Tarea[]> {
        return this.http.get<Tarea[]>(`${this.url}tareas`, { headers: this.headers });
    }

    borrar(tareaId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tareas/${tareaId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tareas/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tareaId: number, tarea: Tarea): Observable<Tarea> {
        return this.http.put<Tarea>(`${this.url}tareas/${tareaId}`, tarea);
    }

    crear(tarea: Tarea): Observable<Tarea> {
        return this.http.post<Tarea>(`${this.url}tareas`, tarea);
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
        return this.http.get(`${this.url}core/filter/tareas`, { params, headers: this.headers });
    }
}
