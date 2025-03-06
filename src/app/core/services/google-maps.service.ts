import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoogleMapsService {

    constructor(private http: HttpClient) { }

    // Método para obtener la latitud y longitud de una dirección
    getLatLong(address: string): Observable<any> {
        const apiKey = 'AIzaSyD7ILjGwf7Vqp3kD4lOQ5qCuv6ytHCplHg';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        return this.http.get(apiUrl);
    }
}
