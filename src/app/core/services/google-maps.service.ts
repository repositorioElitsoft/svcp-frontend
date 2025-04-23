import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressDetails } from '../models/address-details.model';

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

    // Método para transformar los resultados del geocoding en la interfaz AddressDetails
    parseAddress(results: any): AddressDetails {
        if (!results || results.status !== 'OK') {
            throw new Error('No se pudo obtener la dirección.');
        }

        const result = results.results[0]; // Usamos el primer resultado

        const addressDetails: AddressDetails = {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            formattedAddress: result.formatted_address,
            country: this.getAddressComponent(result, 'country'),
            countryCode: this.getAddressComponent(result, 'country', 'short_name'),
            administrativeArea: this.getAddressComponent(result, 'administrative_area_level_1'),
            administrativeAreaLevel2: this.getAddressComponent(result, 'administrative_area_level_2'),
            administrativeAreaLevel3: this.getAddressComponent(result, 'administrative_area_level_3'),
            locality: this.getAddressComponent(result, 'locality'),
            sublocality: this.getAddressComponent(result, 'sublocality'),
            postalCode: this.getAddressComponent(result, 'postal_code'),
            street: this.getAddressComponent(result, 'route'),
            streetNumber: this.getAddressComponent(result, 'street_number'),
            neighborhood: this.getAddressComponent(result, 'neighborhood'),
        };

        return addressDetails;
    }

    // Función para obtener un componente específico de la dirección
    private getAddressComponent(result: any, type: string, componentType: string = 'long_name'): string | undefined {
        const component = result.address_components.find((c: any) => c.types.includes(type));
        return component ? component[componentType] : undefined;
    }
}
