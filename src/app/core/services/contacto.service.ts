import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Contacto } from "../models/contacto.model";
import { ApiEntityResponse } from "../models/api-entity-response.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ContactoService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(contactoId: number): Observable<Contacto> {
        return this.http.get<Contacto>(`${this.url}contactos/${contactoId}`);
    }

    buscarTodos(clienteId?: number): Observable<Contacto[]> {
        if (clienteId) {
            return this.http.get<Contacto[]>(`${this.url}contactos/clientes/${clienteId}`);
        }
        return this.http.get<Contacto[]>(`${this.url}contactos`);
    }

    borrar(contactoId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}contactos/${contactoId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}contactos/lote`, { body: ids });
    }

    actualizar(contactoId: number, contacto: Contacto): Observable<Contacto> {
        return this.http.put<Contacto>(`${this.url}contactos/${contactoId}`, contacto);
    }

    crear(contacto: Contacto): Observable<ApiEntityResponse<Contacto>> {
        return this.http.post<ApiEntityResponse<Contacto>>(`${this.url}contactos`, contacto);
    }

    buscarFiltrado(filtros: { [key: string]: any }): Observable<any> {
        let params = new HttpParams();
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key) && filtros[key] !== null && filtros[key] !== undefined) {
                params = params.append(key, filtros[key]);
            }
        }
        // Hacer la solicitud GET con los parámetros dinámicos
        return this.http.get(`${this.url}core/filter/contactos`, { params });
    }
}
