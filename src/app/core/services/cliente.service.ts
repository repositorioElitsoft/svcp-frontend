import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cliente } from '../../core/models/cliente.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ClienteService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(clienteId: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.url}clientes/${clienteId}`);
    }

    buscarTodos(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(`${this.url}clientes`, { headers: this.headers });
    }

    borrar(clienteId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}clientes/${clienteId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}clientes/lote`, { headers: this.headers, body: ids });
    }

    actualizar(clienteId: number, cliente: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.url}clientes/${clienteId}`, cliente);
    }

    crear(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(`${this.url}clientes`, cliente);
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
        return this.http.get(`${this.url}core/filter/clientes`, { params, headers: this.headers });
    }
}
