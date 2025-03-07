// locacion-maps.service.ts
import { Injectable } from '@angular/core';
import { GoogleMapsService } from './google-maps.service';
import { AddressDetails } from '../models/address-details.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comuna } from '../models/comuna.model';

@Injectable({
    providedIn: 'root'
})
export class LocacionMapsService {

    constructor(private mapsService: GoogleMapsService) { }

    geocodeAddress(address: string): Observable<AddressDetails | null> {
        return this.mapsService.getLatLong(address).pipe(
            map(response => {
                if (!response?.results?.length) return null;
                return this.processGeocodeResponse(response.results[0], address);
            })
        );
    }

    private processGeocodeResponse(result: any, originalAddress: string): AddressDetails {
        const location = result.geometry.location;
        const components = this.extractAddressComponents(result.address_components, originalAddress);

        return {
            street: components.street,
            streetNumber: components.streetNumber,
            administrativeAreaLevel3: components.comuna,
            lat: location.lat,
            lng: location.lng,
            formattedAddress: result.formatted_address
        };
    }

    private extractAddressComponents(addressComponents: any[], originalAddress: string): { street: string, streetNumber: string, comuna: string } {

        let street = '';
        let streetNumber = '';
        let comuna = '';

        for (const component of addressComponents) {
            if (component.types.includes('route')) {
                street = component.long_name;
            } else if (component.types.includes('street_number')) {
                streetNumber = component.long_name;
            } else if (component.types.includes('locality')) {
                comuna = component.long_name;
            }
        }

        if (!streetNumber && originalAddress) {
            const addressParts = originalAddress.trim().split(' ');
            streetNumber = addressParts.pop() || '';
            street = addressParts.join(' ');
        }

        return { street, streetNumber, comuna };
    }

    findComuna(comunaName: string | undefined, comunas: Comuna[]): Comuna | undefined {
        if (!comunaName) return undefined;
        return comunas.find(c =>
            c.descripcionComuna.toLowerCase() === comunaName.toLowerCase()
        );
    }
}