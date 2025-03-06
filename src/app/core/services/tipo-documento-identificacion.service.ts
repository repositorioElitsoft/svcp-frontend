import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoDocumentoIdentificacion } from '../../core/models/tipo-documento-identificacion.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class TipoDocumentoIdentificacionService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(tipoDocumentoIdentificacionId: number): Observable<TipoDocumentoIdentificacion> {
        return this.http.get<TipoDocumentoIdentificacion>(`${this.url}tipos-documentos-identificaciones/${tipoDocumentoIdentificacionId}`);
    }

    buscarTodos(): Observable<TipoDocumentoIdentificacion[]> {
        return this.http.get<TipoDocumentoIdentificacion[]>(`${this.url}tipos-documentos-identificaciones`, { headers: this.headers });
    }

    borrar(tipoDocumentoIdentificacionId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-documentos-identificaciones/${tipoDocumentoIdentificacionId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}tipos-documentos-identificaciones/lote`, { headers: this.headers, body: ids });
    }

    actualizar(tipoDocumentoIdentificacionId: number, tipoDocumentoIdentificacion: TipoDocumentoIdentificacion): Observable<TipoDocumentoIdentificacion> {
        return this.http.put<TipoDocumentoIdentificacion>(`${this.url}tipos-documentos-identificaciones/${tipoDocumentoIdentificacionId}`, tipoDocumentoIdentificacion);
    }

    crear(tipoDocumentoIdentificacion: TipoDocumentoIdentificacion): Observable<TipoDocumentoIdentificacion> {
        return this.http.post<TipoDocumentoIdentificacion>(`${this.url}tipos-documentos-identificaciones`, tipoDocumentoIdentificacion);
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
        return this.http.get(`${this.url}core/filter/tipos-documentos-identificaciones`, { params, headers: this.headers });
    }
}
