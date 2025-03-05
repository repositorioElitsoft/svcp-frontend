// components/map/map.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMap, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  template: `
    <google-map 
        [center]="center"
        [zoom]="zoom"
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
  styles: [`
    :host { 
      display: block;
      width: 100%;
    }
  `]
})
export class MapComponent implements OnChanges {
  @Input() initialPosition!: google.maps.LatLngLiteral;
  @Input() zoom = 12;
  @Output() positionChanged = new EventEmitter<google.maps.LatLngLiteral>();

  center!: google.maps.LatLngLiteral;
  markerPosition!: google.maps.LatLngLiteral;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPosition']) {
      this.center = this.initialPosition;
      this.markerPosition = this.initialPosition;
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updatePosition(event.latLng.toJSON());
    }
  }

  onMarkerMoved(marker: MapMarker) {
    const position = marker.getPosition();
    if (position) {
      this.updatePosition(position.toJSON());
    }
  }

  private updatePosition(position: google.maps.LatLngLiteral) {
    this.markerPosition = position;
    this.center = position;
    this.positionChanged.emit(position);
  }
}
