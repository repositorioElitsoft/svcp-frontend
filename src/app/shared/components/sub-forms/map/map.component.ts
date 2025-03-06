import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

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
          (positionChanged)="onMarkerMoved(marker)">
      </map-marker>
    </google-map>
  `,
  styles: [`:host { display: block; width: 100%; }`]
})
export class MapComponent implements OnChanges {
  @Input() initialPosition!: google.maps.LatLngLiteral;
  @Input() zoom = 12;
  @Output() positionChanged = new EventEmitter<google.maps.LatLngLiteral>();

  center!: google.maps.LatLngLiteral;
  markerPosition!: google.maps.LatLngLiteral;

  mapOptions: google.maps.MapOptions = {
    gestureHandling: 'auto', // Permite zoom con scroll y navegación con gestos
    scrollwheel: true, // Habilita la navegación con el mouse
    disableDoubleClickZoom: false, // Permite zoom con doble clic
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPosition']) {
      this.center = this.initialPosition;
      this.markerPosition = this.initialPosition;
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updateMarkerPosition(event.latLng.toJSON());
    }
  }

  onMarkerMoved(marker: any) {
    const position = marker.getPosition();
    if (position) {
      this.updateMarkerPosition(position.toJSON());
    }
  }

  private updateMarkerPosition(position: google.maps.LatLngLiteral) {
    this.markerPosition = position;
    this.positionChanged.emit(position);
  }
}
