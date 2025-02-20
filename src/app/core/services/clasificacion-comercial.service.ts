import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ClasificacionComercial } from '../../models/clasificacion-comercial.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ClasificacionComercialService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    buscar(clasificacionComercialId: number): Observable<ClasificacionComercial> {
        return this.http.get<ClasificacionComercial>(`${this.url}clasificaciones-comerciales/${clasificacionComercialId}`);
    }
    buscarTodos(): Observable<ClasificacionComercial[]> {
        return this.http.get<ClasificacionComercial[]>(`${this.url}clasificaciones-comerciales/`);
    }
    borrar(clasificacionComercialId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}clasificaciones-comerciales/${clasificacionComercialId}`);
    }
    actualizar(clasificacionComercialId: number,clasificacionComercial: ClasificacionComercial): Observable<ClasificacionComercial> {
        return this.http.put<ClasificacionComercial>(`${this.url}clasificaciones-comerciales/${clasificacionComercialId}`,clasificacionComercial);
    }
    crear(clasificacionComercial: ClasificacionComercial): Observable<ClasificacionComercial> {
        return this.http.post<ClasificacionComercial>(`${this.url}clasificaciones-comerciales`,clasificacionComercial);
    }

}