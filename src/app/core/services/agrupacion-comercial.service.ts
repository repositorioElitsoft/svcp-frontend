import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { AgrupacionComercial } from '../../core/models/agrupacion-comercial.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class AgrupacionComercialService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(agrupacionComercialId: number): Observable<AgrupacionComercial> {
        return this.http.get<AgrupacionComercial>(`${this.url}agrupacioncomercial/${agrupacionComercialId}`);
    }

    buscarTodos(): Observable<AgrupacionComercial[]> {
        return this.http.get<AgrupacionComercial[]>(`${this.url}agrupacioncomercial/lote`, { headers: this.headers });
    }

    borrar(agrupacionComercialId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}agrupacioncomercial/${agrupacionComercialId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}agrupacioncomercial/lote`, { headers: this.headers, body: ids });
    }

    actualizar(agrupacionComercialId: number, agrupacionComercial: AgrupacionComercial): Observable<AgrupacionComercial> {
        return this.http.put<AgrupacionComercial>(`${this.url}agrupacioncomercial/${agrupacionComercialId}`, agrupacionComercial);
    }

    crear(agrupacionComercial: AgrupacionComercial): Observable<AgrupacionComercial> {
        return this.http.post<AgrupacionComercial>(`${this.url}agrupacioncomercial`, agrupacionComercial);
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
        return this.http.get(`${this.url}core/filter/agrupacioncomercial`, { params, headers: this.headers });
    }
}
