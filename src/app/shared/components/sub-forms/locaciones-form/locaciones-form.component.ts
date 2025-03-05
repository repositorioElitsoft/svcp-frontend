import { Component, Inject, inject, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { GoogleMapsService } from "../../../../core/services/google-maps.service"
import { MapComponent } from "../map/map.component"

// Angular Material Imports
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatDialogRef } from "@angular/material/dialog"

declare var google: any

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
  form!: FormGroup
  initialPosition: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 };

  constructor(
    private fb: FormBuilder,
    @Inject(GoogleMapsService) private mapsService: GoogleMapsService
  ) { }

  ngOnInit() {
    this.initForm()
    this.setupFormListeners()
  }


  readonly dialogRef = inject(MatDialogRef<LocacionesFormComponent>);


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
    })
  }

  private setupFormListeners() {
    this.form.get("direccion")?.valueChanges.subscribe(() => this.onAddressChange())
    this.form.get("numeracion")?.valueChanges.subscribe(() => this.onAddressChange())
  }

  async onAddressChange() {
    const address = `${this.form.value.direccion} ${this.form.value.numeracion}, ${this.form.value.comuna}`

    if (this.form.value.direccion && this.form.value.comuna) {
      try {
        const response = await this.mapsService.getLatLong(address).toPromise()
        if (response?.results && response.results.length > 0) {
          const location = response.results[0].geometry.location
          this.form.patchValue(
            {
              latitud: location.lat,
              longitud: location.lng,
            },
            { emitEvent: false },
          )
        }
      } catch (error) {
        console.error("Error geocoding address:", error)
      }
    }
  }

  async onMapPositionChanged(position: google.maps.LatLngLiteral) {
    try {
      const response = await this.mapsService.reverseGeocode(position.lat, position.lng).toPromise()
      if (response?.results && response.results.length > 0) {
        const address = this.parseAddress(response.results[0])
        this.form.patchValue(
          {
            ...address,
            latitud: position.lat,
            longitud: position.lng,
          },
          { emitEvent: false },
        )
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
    }
  }

  private parseAddress(result: any) {
    const address = {
      comuna: "",
      direccion: "",
      numeracion: "",
    }

    result.address_components.forEach((component: any) => {
      if (component.types.includes("route")) {
        address.direccion = component.long_name
      }
      if (component.types.includes("street_number")) {
        address.numeracion = component.long_name
      }
      if (component.types.includes("administrative_area_level_2")) {
        address.comuna = component.long_name
      }
    })

    return address
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Formulario enviado:", this.form.value)
      // Lógica para enviar a tu API
    }
  }
}
