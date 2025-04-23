import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ClasificacionComercialService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    buscar(clasificacionComercialId: number): Observable<ClasificacionComercialService> {
        return this.http.get<ClasificacionComercialService>(`${this.url}clasificaciones-comerciales/${clasificacionComercialId}`);
    }
    buscarTodos(): Observable<ClasificacionComercialService[]> {
        return this.http.get<ClasificacionComercialService[]>(`${this.url}clasificaciones-comerciales/`);
    }
    borrar(clasificacionComercialId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}clasificaciones-comerciales/${clasificacionComercialId}`);
    }
    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}clasificaciones-comerciales/lote`, { body: ids });
    }
    actualizar(clasificacionComercialId: number, clasificacionComercial: ClasificacionComercialService): Observable<ClasificacionComercialService> {
        return this.http.put<ClasificacionComercialService>(`${this.url}clasificaciones-comerciales/${clasificacionComercialId}`, clasificacionComercial);
    }
    crear(clasificacionComercial: ClasificacionComercialService): Observable<ClasificacionComercialService> {
        return this.http.post<ClasificacionComercialService>(`${this.url}clasificaciones-comerciales`, clasificacionComercial);
    }

}