// map.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { GoogleMapsService } from '../../../../core/services/google-maps.service';
import { AddressDetails } from '../../../../core/models/address-details.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  template: `
    <google-map 
        [center]="center"
        [zoom]="zoom"
        [options]="mapOptions"
        (mapClick)="onMapClick($event)"
        width="100%"
        height="400px">
      <map-marker
          #marker="mapMarker"
          [position]="markerPosition"
          [options]="{ draggable: true }"
          (mapDragend)="onMarkerMoved(marker)">
      </map-marker>
    </google-map>
  `,
  styles: [`:host { display: block; width: 100%; }`]
})
export class MapComponent implements OnChanges {
  private mapsService = inject(GoogleMapsService);

  @Input() initialPosition!: google.maps.LatLngLiteral;
  @Input() markerPosition!: google.maps.LatLngLiteral;
  @Output() positionChanged = new EventEmitter<AddressDetails>();

  center!: google.maps.LatLngLiteral;
  zoom = 12;
  mapOptions: google.maps.MapOptions = { gestureHandling: 'auto' };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPosition'] || changes['markerPosition']) {
      this.center = this.markerPosition || this.initialPosition;
      this.markerPosition = this.markerPosition || this.initialPosition;
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updatePosition(event.latLng.toJSON());
    }
  }

  onMarkerMoved(marker: any) {
    const position = marker.getPosition()?.toJSON();
    if (position) this.updatePosition(position);
  }

  private updatePosition(position: google.maps.LatLngLiteral) {
    this.markerPosition = position;
    this.mapsService.getAddress(position.lat, position.lng).subscribe({
      next: (results) => {
        const addressDetails = this.parseAddress(results);
        this.positionChanged.emit(addressDetails);
      },
      error: (err) => console.error('Error en geocodificación inversa:', err)
    });
  }

  private parseAddress(results: any[]): AddressDetails {
    const address: AddressDetails = { lat: this.markerPosition.lat, lng: this.markerPosition.lng };
    if (!results?.length) return address;

    const result = results[0];
    address.formattedAddress = result.formatted_address;

    for (const comp of result.address_components) {
      const type = comp.types[0];
      switch (type) {
        case 'street_number':
          address.streetNumber = comp.long_name;
          break;
        case 'route':
          address.street = comp.long_name;
          break;
        case 'sublocality':
        case 'administrative_area_level_3':
          address.comuna = comp.long_name;
          break;
        case 'locality':
          address.locality = comp.long_name;
          break;
        case 'administrative_area_level_1':
          address.administrativeArea = comp.long_name;
          break;
        case 'country':
          address.country = comp.long_name;
          break;
      }
    }
    return address;
  }
}