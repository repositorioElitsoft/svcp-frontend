import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, EventEmitter, Output } from "@angular/core";
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
import { Estado } from "../../../../core/models/estados.model";
import { Provincia } from "../../../../core/models/provincia.models";
import { Region } from "../../../../core/models/region.models";
import { ComunaService } from "../../../../core/services/comuna.service";
import { ProvinciaService } from "../../../../core/services/provincias.service";
import { RegionService } from "../../../../core/services/regiones.service";
import { EstadoService } from "../../../../core/services/estado.service";
import { DireccionEmpleadoService } from "../../../../core/services/direccion-empleado.service";
import { convertErrorMessageToI18 } from "../../../../core/utils/errors.utils";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-locaciones-empleado-form",
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
  templateUrl: "./locaciones-empleado-form.component.html",
})
export class LocacionesEmpleadoFormComponent implements OnInit, AfterViewInit {
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef;
  form!: FormGroup;
  initialPosition = { lat: -33.4489, lng: -70.6693 };
  currentMarkerPosition!: google.maps.LatLngLiteral;
  comunas: Comuna[] = [];
  estados: Estado[] = [];
  provincias: Provincia[] = [];
  regiones: Region[] = [];
  direccionCombinada: string = '';
  @Input() id: string | null = null;
  @Output() formularioEnviado = new EventEmitter<void>();
  private autocomplete!: google.maps.places.Autocomplete;

  constructor(
    private fb: FormBuilder,
    private locacionMaps: LocacionMapsService,
    private provinciaService: ProvinciaService,
    private comunaService: ComunaService,
    private regionService: RegionService,
    private estadoServicio: EstadoService,
    private direccionEmpleado: DireccionEmpleadoService,
    private translate: TranslateService, private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
    this.setupFormListeners();
    this.cargarUbicaciones()
    this.cargarEstado();
    console.log('ID recibido:', this.id);
  }


  private initForm() {
    this.form = this.fb.group({
      id: [null],
      estado: [{ id: null }],
      comuna: [null],
      calle: [""],
      numeracion: [""],
      latitud: [null],
      longitud: [null],
      descripcion: [""],
      referencia: [""],
      empleado: [{ id: this.id }]
    });
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  private initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.nativeElement,
      {
        types: ['address'],
        componentRestrictions: { country: 'cl' },
        fields: ['address_components', 'geometry', 'formatted_address']
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.log('No hay detalles disponibles para la dirección seleccionada');
        return;
      }

      const addressDetails: AddressDetails = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        formattedAddress: place.formatted_address || '',
        street: this.getAddressComponent(place, 'route'),
        streetNumber: this.getAddressComponent(place, 'street_number'),
        administrativeAreaLevel3: this.getAddressComponent(place, 'administrative_area_level_3'),
      };

      this.updateFormFromAddressDetails(addressDetails);
      this.currentMarkerPosition = { lat: addressDetails.lat, lng: addressDetails.lng };
    });
  }

  private getAddressComponent(place: google.maps.places.PlaceResult, type: string): string {
    return place.address_components?.find(c => c.types.includes(type))?.long_name || '';
  }



  private setupFormListeners() {
    this.form.get('direccion')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(() => this.getFullAddress())
    ).subscribe(
      (details) => this.handleAddressUpdate(details as AddressDetails | null),
      (err) => console.error('Error en geocodificación:', err)
    );
  }


  private getFullAddress(): Observable<AddressDetails | null> {
    const direccionCompleta = `${this.form.value.calle} ${this.form.value.numeracion}`.trim();
    return direccionCompleta
      ? this.locacionMaps.geocodeAddress(direccionCompleta)
      : of(null);
  }

  private handleAddressUpdate(details: AddressDetails | null) {
    if (!details) return;

    this.currentMarkerPosition = { lat: details.lat, lng: details.lng };

    let calle = details.street || details.formattedAddress;
    if (calle && calle.includes('+')) {
      calle = details.formattedAddress;
    }

    this.form.patchValue({
      calle: calle,
      numeracion: details.streetNumber,
      latitud: details.lat,
      longitud: details.lng,
      comuna: this.locacionMaps.findComuna(details.administrativeAreaLevel3, this.comunas)
    }, { emitEvent: false });
  }

  onMapPositionChanged(details: AddressDetails) {
    this.updateFormFromAddressDetails(details);
    this.direccionCombinada = `${details.street} ${details.streetNumber}`;  // Actualiza la dirección combinada
  }


  private updateFormFromAddressDetails(details: AddressDetails) {
    this.form.patchValue({
      calle: details.street,
      numeracion: details.streetNumber,
      latitud: details.lat,
      longitud: details.lng,
      comuna: this.locacionMaps.findComuna(details.administrativeAreaLevel3, this.comunas)
    }, { emitEvent: false });
  }



  private cargarUbicaciones() {
    // Cargar todas las regiones al inicio
    this.regionService.buscarTodos().subscribe(regiones => {
      this.regiones = regiones;
    });

    this.form.get('region')?.valueChanges.subscribe(region => {
      if (region) {
        console.log('ID de la región:', region.id);  // Asegúrate de que el ID de la región es correcto

        if (region.id) {
          // Resetear provincia y comuna cuando cambia la región
          this.form.patchValue({ provincia: null, comuna: null });
          this.form.get('provincia')?.disable();
          this.form.get('comuna')?.disable();

          // Cargar provincias filtradas por la región seleccionada
          this.provinciaService.buscarTodos(region.id).subscribe(provincias => {
            this.provincias = provincias;
            this.form.get('provincia')?.enable();
          });
        } else {
          console.error('El ID de la región es undefined o inválido');
        }
      }
    });


    // Escuchar cambios en Provincia
    this.form.get('region')?.valueChanges.subscribe(region => {
      console.log('Valor de región:', region);  // Verifica el valor completo del objeto 'region'
      if (region && region.id) {
        console.log('ID de la región:', region.id);  // Verifica que el ID de la región es válido
        this.form.patchValue({ provincia: null, comuna: null });
        this.form.get('provincia')?.disable();
        this.form.get('comuna')?.disable();

        // Llamada al servicio con el ID de la región
        this.provinciaService.buscarTodos(region.id).subscribe(provincias => {
          this.provincias = provincias;
          this.form.get('provincia')?.enable();
        });
      } else {
        console.error('El ID de la región es inválido:', region);
      }
    });
  }

  onRegionSeleccionada(regionId: number) {
    console.log('ID de la región:', regionId);  // Verifica que el ID de la región es válido
    if (regionId) {
      // Resetear provincia y comuna cuando cambia la región
      this.form.patchValue({ provincia: null, comuna: null });
      this.form.get('provincia')?.disable();
      this.form.get('comuna')?.disable();

      // Cargar provincias filtradas por la región seleccionada
      this.provinciaService.buscarTodos(regionId).subscribe(provincias => {
        this.provincias = provincias;
        this.form.get('provincia')?.enable();
      });
    } else {
      console.error('El ID de la región es inválido:', regionId);
    }
  }

  onProvinciaSeleccionada(provincia: number) {
    // Resetear comuna cuando cambia la provincia
    this.form.patchValue({ comuna: null });
    this.form.get('comuna')?.disable();

    // Cargar comunas filtradas por la provincia seleccionada
    this.comunaService.buscarTodos(provincia).subscribe(comunas => {
      this.comunas = comunas;
      this.form.get('comuna')?.enable();
    });
  }

  cargarEstado() {
    this.estadoServicio.buscarTodos().subscribe(estados => {
      this.estados = estados;
    });

  }
  // Actualiza la dirección combinada en el input
  actualizarDireccion(event: any) {
    this.direccionCombinada = event.target.value;
  }

  // Separa la dirección y el número cuando el input pierde el foco
  separarDireccion() {
    const direccionCompleta = this.direccionCombinada.trim();
    const match = direccionCompleta.match(/^(.*\D)\s(\d+)$/);

    if (match) {
      this.form.patchValue({
        calle: match[1].trim(),
        numeracion: match[2]
      });
    } else {
      // Si no se puede separar, asigna la dirección completa a la calle
      this.form.patchValue({
        calle: direccionCompleta,
        numeracion: ''
      });
    }
  }
  // Método que se llama cuando se hace clic en el botón
  onSubmit() {
    if (this.form.valid) {
      console.log("Formulario enviado:", this.form.value);

      // Llamada al servicio para guardar el empleado
      this.direccionEmpleado.crear(this.form.value).subscribe({
        next: (empleado) => {
          console.log('Empleado guardado:', empleado);
          this.toastr.success(this.translate.instant('alertas.toastr.success')); // Mensaje de éxito

          // Emitir el evento de éxito al padre
          this.formularioEnviado.emit();

          // Restablecer el formulario a su estado inicial
          this.form.reset({
            estado: { id: 1 },  // Asignar valores iniciales
            empleado: { id: this.id },
            comuna: null,
            calle: "",
            numeracion: "",
            latitud: null,
            longitud: null,
            descripcion: "",
            referencia: "",
          });

          // Restablecer la dirección combinada y cualquier otro estado local
          this.direccionCombinada = '';
        },
        error: (error) => {
          console.error('Error al guardar el empleado:', error);
          this.toastr.error(this.translate.instant(convertErrorMessageToI18(error.message))); // Mensaje de error
        }
      });
    } else {
      console.log("Formulario no válido");
      this.toastr.warning(this.translate.instant('alertas.toastr.formularioInvalido')); // Advertencia si el formulario no es válido
    }
  }

  onEnviarFormulario() {
    this.formularioEnviado.emit();  // El formulario se envió correctamente
  }

}