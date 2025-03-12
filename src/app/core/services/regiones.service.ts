import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Region } from "../models/region.models";




@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class RegionService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(regionId: number): Observable<Region> {
        return this.http.get<Region>(`${this.url}regiones/${regionId}`);
    }

    buscarTodos(): Observable<Region[]> {
        return this.http.get<Region[]>(`${this.url}regiones/paises/1`);
    }


    borrar(regionId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}regiones/${regionId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}regiones/lote`, { body: ids });
    }

    actualizar(regionId: number, region: Region): Observable<Region> {
        return this.http.put<Region>(`${this.url}regiones/${regionId}`, region);
    }

    crear(region: Region): Observable<Region> {
        return this.http.post<Region>(`${this.url}regiones`, region);
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
        return this.http.get(`${this.url}core/filter/regiones`, { params });
    }
}
