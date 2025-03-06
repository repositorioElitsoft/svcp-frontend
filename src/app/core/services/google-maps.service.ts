import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
    private apiKey = 'AIzaSyD7ILjGwf7Vqp3kD4lOQ5qCuv6ytHCplHg';

    constructor(private http: HttpClient) { }

    // Geocoding: Dirección → Coordenadas
    getLatLong(address: string): Observable<any> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
        return this.http.get(url);
    }

    // Reverse Geocoding: Coordenadas → Dirección
    getAddress(lat: number, lng: number): Observable<any> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
        return this.http.get(url);
    }
}