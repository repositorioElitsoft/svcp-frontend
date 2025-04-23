import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sector } from '../../core/models/sector.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class SectorService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(sectorId: number): Observable<ApiEntityResponse<Sector>> {
        return this.http.get<ApiEntityResponse<Sector>>(`${this.url}sectores/${sectorId}`);
    }

    buscarTodos(zonaId: number): Observable<ApiEntityResponse<Sector[]>> {
        return this.http.get<ApiEntityResponse<Sector[]>>(`${this.url}sectores/zonas/${zonaId}`);
    }

    borrar(sectorId: number): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}sectores/${sectorId}`);
    }

    borrarTodos(ids: number[]): Observable<ApiEntityResponse<any>> {
        return this.http.delete<ApiEntityResponse<any>>(`${this.url}sectores/lote`, { headers: this.headers, body: ids });
    }

    actualizar(sectorId: number, sector: Sector): Observable<Sector> {
        return this.http.put<Sector>(`${this.url}sectores/${sectorId}`, sector);
    }

    crear(sector: Sector): Observable<Sector> {
        return this.http.post<Sector>(`${this.url}sectores`, sector);
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
        return this.http.get(`${this.url}core/filter/sectores`, { params, headers: this.headers });
    }
}
