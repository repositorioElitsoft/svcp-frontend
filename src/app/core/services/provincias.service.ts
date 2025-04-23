import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Provincia } from "../models/provincia.models";





@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ProvinciaService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(provinciaId: number): Observable<Provincia> {
        return this.http.get<Provincia>(`${this.url}provincias/${provinciaId}`);
    }

    buscarTodos(regionId: number): Observable<Provincia[]> {
        return this.http.get<Provincia[]>(`${this.url}provincias/regiones/${regionId}`);
    }


    borrar(provinciaId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}provincias/${provinciaId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}provincias/lote`, { body: ids });
    }

    actualizar(provinciaId: number, provincia: Provincia): Observable<Provincia> {
        return this.http.put<Provincia>(`${this.url}provincias/${provinciaId}`, provincia);
    }

    crear(provincia: Provincia): Observable<Provincia> {
        return this.http.post<Provincia>(`${this.url}provincias`, provincia);
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
        return this.http.get(`${this.url}core/filter/provincias`, { params });
    }
}
