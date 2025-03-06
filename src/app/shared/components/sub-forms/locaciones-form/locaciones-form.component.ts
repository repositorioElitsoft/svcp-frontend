import { Component, Inject, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { GoogleMapsService } from "../../../../core/services/google-maps.service";
import { MapComponent } from "../map/map.component";

// Angular Material Imports
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialogRef } from "@angular/material/dialog";
import { switchMap, debounceTime } from 'rxjs/operators';

declare var google: any;

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
  initialPosition: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 };

  constructor(
    private fb: FormBuilder,
    @Inject(GoogleMapsService) private mapsService: GoogleMapsService
  ) { }

  readonly dialogRef = inject(MatDialogRef<LocacionesFormComponent>);

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
    this.form.get("direccion")?.valueChanges.pipe(
      debounceTime(500),
      switchMap(() => this.onAddressChange())
    ).subscribe();

    this.form.get("numeracion")?.valueChanges.pipe(
      debounceTime(500),
      switchMap(() => this.onAddressChange())
    ).subscribe();
  }

  private async onAddressChange() {
    const address = `${this.form.value.direccion} ${this.form.value.numeracion}, ${this.form.value.comuna}`;

    if (this.form.value.direccion && this.form.value.comuna) {
      try {
        const response = await this.mapsService.getLatLong(address).toPromise();
        if (response?.results?.length > 0) {
          const location = response.results[0].geometry.location;
          this.form.patchValue({ latitud: location.lat, longitud: location.lng }, { emitEvent: false });
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Formulario enviado:", this.form.value);
      // Lógica para enviar a tu API
    }
  }

  onMapPositionChanged(position: google.maps.LatLngLiteral) {
    this.form.patchValue({
      latitud: position.lat,
      longitud: position.lng
    });
  }

}
