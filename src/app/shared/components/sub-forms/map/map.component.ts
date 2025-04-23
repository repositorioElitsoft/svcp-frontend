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
  private mapsService = inject(GoogleMapsService); // Inyectamos el servicio

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

  // Método que se ejecuta cuando se hace clic en el mapa
  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const position = event.latLng.toJSON();
      console.log("Clic en el mapa, nueva posición:", position);
      this.updatePosition(position);
    }
  }

  // Método que se ejecuta cuando se mueve el marcador
  onMarkerMoved(marker: any) {
    const position = marker.getPosition()?.toJSON();
    if (position) {
      console.log("Marcador movido, nueva posición:", position);
      this.updatePosition(position);
    }
  }

  // Actualizamos la posición y obtenemos la dirección
  private updatePosition(position: google.maps.LatLngLiteral) {
    console.log("Posición actualizada:", position);
    this.markerPosition = position;
    this.center = position;

    // Llamamos al servicio para obtener la dirección
    this.mapsService.getAddress(position.lat, position.lng).subscribe({
      next: (results) => {
        const addressDetails = this.mapsService.parseAddress(results); // Usamos parseAddress para estructurar los datos
        console.log("Detalles de la dirección obtenidos:", addressDetails);
        this.positionChanged.emit(addressDetails); // Emitimos el evento con la dirección
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
