import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LocacionMapsService } from "../../../../core/services/locacion-maps.service";
import { MapComponent } from "../map/map.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { debounceTime, switchMap } from 'rxjs/operators';
import { AddressDetails } from "../../../../core/models/address-details.model";
import { Comuna } from "../../../../core/models/comuna.model";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs";

@Component({
  selector: "app-locaciones-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MapComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./locaciones-form.component.html",
})
export class LocacionesFormComponent implements OnInit {
  form!: FormGroup;
  initialPosition = { lat: -33.4489, lng: -70.6693 };
  currentMarkerPosition!: google.maps.LatLngLiteral;
  comunas: Comuna[] = [];

  constructor(
    private fb: FormBuilder,
    private locacionMaps: LocacionMapsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.setupFormListeners();
  }

  private initForm() {
    this.form = this.fb.group({
      nombre: [""],
      comuna: [""],
      direccion: [""],
      numeracion: [""],
      referencia: [""],
      latitud: [null],
      longitud: [null],
      sector: [""],
      tipoLocacion: [""],
      solicitaEvidencia: [false],
    });
  }

  private setupFormListeners() {
    const addressControls = ['direccion', 'numeracion'];

    addressControls.forEach(controlName => {
      this.form.get(controlName)?.valueChanges.pipe(
        debounceTime(500),
        switchMap(() => this.getFullAddress())
      ).subscribe(
        (value) => this.handleAddressUpdate(value as AddressDetails | null),
        (err) => console.error('Error en geocodificación:', err)
      );
    });
  }

  private getFullAddress(): Observable<AddressDetails | null> {
    const direccionCompleta = `${this.form.value.direccion} ${this.form.value.numeracion}`.trim();
    return direccionCompleta
      ? this.locacionMaps.geocodeAddress(direccionCompleta)
      : of(null);
  }

  private handleAddressUpdate(details: AddressDetails | null) {
    if (!details) return;

    this.currentMarkerPosition = { lat: details.lat, lng: details.lng };

    this.form.patchValue({
      direccion: details.street,
      numeracion: details.streetNumber,
      latitud: details.lat,
      longitud: details.lng,
      comuna: this.locacionMaps.findComuna(details.administrativeAreaLevel2, this.comunas)
    }, { emitEvent: false });
  }

  onMapPositionChanged(details: AddressDetails) {
    this.updateFormFromAddressDetails(details);
  }

  private updateFormFromAddressDetails(details: AddressDetails) {
    this.form.patchValue({
      direccion: details.street,
      numeracion: details.streetNumber,
      latitud: details.lat,
      longitud: details.lng,
      comuna: this.locacionMaps.findComuna(details.administrativeAreaLevel2, this.comunas)
    }, { emitEvent: false });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Formulario enviado:", this.form.value);
    }
  }
}