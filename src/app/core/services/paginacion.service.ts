import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaginacionResponse<T> {
    contenido: T[];
    totalElementos: number;
    totalPaginas: number;
    paginaActual: number;
}

@Injectable({
    providedIn: 'root',
})
export class PaginacionService {
    private apiUrl = 'http://localhost:8080/api/datos-paginados'; // URL de tu backend

    constructor(private http: HttpClient) { }

    obtenerPagina<T>(pagina: number, tamanio: number): Observable<PaginacionResponse<T>> {
        return this.http.get<PaginacionResponse<T>>(`${this.apiUrl}?page=${pagina}&size=${tamanio}`);
    }
}
