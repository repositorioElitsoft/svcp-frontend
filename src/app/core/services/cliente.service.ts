import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Cliente } from '../../core/models/cliente.model';
import { ApiEntityResponse } from "../models/api-entity-response.model";

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

    actualizar(clienteId: number, cliente: Cliente): Observable<ApiEntityResponse<string>> {
        return this.http.put<ApiEntityResponse<string>>(`${this.url}clientes/${clienteId}`, cliente);
    }

    crear(cliente: Cliente): Observable<ApiEntityResponse<Cliente>> {
        return this.http.post<ApiEntityResponse<Cliente>>(`${this.url}clientes`, cliente);
    }
    subirImagen(clienteId: number, imagen: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', imagen);

        // Utilizamos un HttpClient directamente sin la configuración de clase
        // y establecemos explícitamente el Content-Type como null para que el navegador lo ajuste automáticamente
        return this.http.post<any>(
            `${this.url}clientes/${clienteId}/imagen`,
            formData,
            {
                headers: new HttpHeaders().delete('Content-Type'),
                reportProgress: true
            }
        );
    }

    descargarImagen(clienteId: number): Observable<File> {
        return this.http.get(`${this.url}clientes/${clienteId}/imagen`, {
            responseType: 'blob',
            observe: 'response'
        }).pipe(
            map(response => {
                // Obtener el nombre del archivo del header Content-Disposition si existe
                const contentDisposition = response.headers.get('content-disposition') || '';
                let filename = 'imagen_cliente.jpg'; // Nombre por defecto

                // Extraer el nombre del archivo si está disponible en el header
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }

                // Determinar el tipo de contenido
                const contentType = response.headers.get('content-type') || 'image/jpeg';

                // Verificar que el body no sea null
                const blob = response.body || new Blob([], { type: contentType });

                // Crear un objeto File a partir del Blob
                return new File([blob], filename, { type: contentType });
            })
        );
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
