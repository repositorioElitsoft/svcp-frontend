import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Role } from '../../core/models/role.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class RoleService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(roleId: number): Observable<Role> {
        return this.http.get<Role>(`${this.url}roles/${roleId}`);
    }

    buscarTodos(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.url}roles`, { headers: this.headers });
    }

    borrar(roleId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}roles/${roleId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}roles/lote`, { headers: this.headers, body: ids });
    }

    actualizar(roleId: number, role: Role): Observable<Role> {
        return this.http.put<Role>(`${this.url}roles/${roleId}`, role);
    }

    crear(role: Role): Observable<Role> {
        return this.http.post<Role>(`${this.url}roles`, role);
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
