// services/google-maps.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoCodeResponse } from '../models/geo-code-response.model';



@Injectable({
    providedIn: 'root'
})
export class GoogleMapsService {
    private readonly apiKey = 'AIzaSyD7ILjGwf7Vqp3kD4lOQ5qCuv6ytHCplHg';

    constructor(private http: HttpClient) { }

    getLatLong(address: string): Observable<GeoCodeResponse> {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
        return this.http.get<GeoCodeResponse>(apiUrl);
    }

    reverseGeocode(lat: number, lng: number): Observable<GeoCodeResponse> {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
        return this.http.get<GeoCodeResponse>(apiUrl);
    }
}