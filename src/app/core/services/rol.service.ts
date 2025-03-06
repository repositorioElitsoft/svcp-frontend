import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rol } from '../../core/models/rol.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class RolService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(rolId: number): Observable<Rol> {
        return this.http.get<Rol>(`${this.url}roles/${rolId}`);
    }

    buscarTodos(): Observable<Rol[]> {
        return this.http.get<Rol[]>(`${this.url}roles`, { headers: this.headers });
    }

    borrar(rolId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}roles/${rolId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}roles/lote`, { headers: this.headers, body: ids });
    }

    actualizar(rolId: number, rol: Rol): Observable<Rol> {
        return this.http.put<Rol>(`${this.url}roles/${rolId}`, rol);
    }

    crear(rol: Rol): Observable<Rol> {
        return this.http.post<Rol>(`${this.url}roles`, rol);
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
        return this.http.get(`${this.url}core/filter/roles`, { params, headers: this.headers });
    }
}
