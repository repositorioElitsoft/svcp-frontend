import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ClasificacionCliente } from '../../core/models/clasificacion-cliente.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ClasificacionClienteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    buscar(clasificacionClienteId: number): Observable<ClasificacionCliente> {
        return this.http.get<ClasificacionCliente>(`${this.url}clasificaciones-clientes/${clasificacionClienteId}`);
    }
    buscarTodos(): Observable<ClasificacionCliente[]> {
        return this.http.get<ClasificacionCliente[]>(`${this.url}clasificaciones-clientes/`);
    }
    borrar(clasificacionClienteId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}clasificaciones-clientes/${clasificacionClienteId}`);
    }
    actualizar(clasificacionClienteId: number, clasificacionCliente: ClasificacionCliente): Observable<ClasificacionCliente> {
        return this.http.put<ClasificacionCliente>(`${this.url}clasificaciones-clientes/${clasificacionClienteId}`, clasificacionCliente);
    }
    crear(clasificacionCliente: ClasificacionCliente): Observable<ClasificacionCliente> {
        return this.http.post<ClasificacionCliente>(`${this.url}clasificaciones-clientes`, clasificacionCliente);
    }

}