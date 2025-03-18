import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, EventEmitter, Output, Inject, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LocacionMapsService } from "../../../../core/services/locacion-maps.service";
import { MapComponent } from "../map/map.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
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
import { convertErrorMessageToI18 } from "../../../../core/utils/errors.utils";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TiposDireccionesService } from "../../../../core/services/tipos-direcciones.service";
import { DireccionService } from "../../../../core/services/direccion.service";
import { TiposDirecciones } from "../../../../core/models/tipos-direcciones.model";
import { Sector } from "../../../../core/models/sector.model";
import { Zona } from "../../../../core/models/zona.model";
import { SectorService } from "../../../../core/services/sector.service";
import { ZonaService } from "../../../../core/services/zona.service";
import { Direccion } from "../../../../core/models/direccion.model";
import { MatExpansionModule } from "@angular/material/expansion";
import { ApiEntityResponse } from "../../../../core/models/api-entity-response.model";

@Component({
  selector: "app-locaciones-cliente-form",
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
    MatExpansionModule
  ],
  templateUrl: "./locaciones-cliente-form.component.html",
})
export class LocacionesClienteFormComponent implements OnInit, AfterViewInit {
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
  @Input() direccionId: number | null = null; // Recibe el ID de la dirección a editar
  @Output() formularioEnviado = new EventEmitter<void>();
  @Inject(MAT_DIALOG_DATA) public data: any  // Inyecta los datos del modal
  private autocomplete!: google.maps.places.Autocomplete;
  tiposDirecciones: TiposDirecciones[] = [];
  sectores: Sector[] = [];
  zonas: Zona[] = [];
  selectedSectorId: number | null = null; // Definir la variable para el sector seleccionado
  selectedZonaId: number | null = null;   // Definir la variable para la zona seleccionada
  expanded: boolean = false;


  constructor(
    private fb: FormBuilder,
    private locacionMaps: LocacionMapsService,
    private provinciaService: ProvinciaService,
    private comunaService: ComunaService,
    private regionService: RegionService,
    private estadoServicio: EstadoService,
    private direccion: DireccionService,
    private translate: TranslateService, private toastr: ToastrService,
    private tipoDireccionService: TiposDireccionesService,
    private sectorService: SectorService,
    private zonaService: ZonaService

  ) { }

  ngOnInit() {
    this.initForm();
    this.setupFormListeners();
    this.cargarUbicaciones();
    this.cargarEstado();
    this.cargarTipoDireccion();
    this.cargarZonas();
  }
  private initForm() {
    this.form = this.fb.group({
      id: [null],
      cliente: this.fb.group({ id: this.id }),
      descripcion: [""],
      calle: [""],
      numeracion: [""],
      referencia: [""],
      comuna: [{ id: null }],
      sector: [{ id: null }],
      contacto: [{ id: null }],
      tipoDireccion: [null],
      imagenPerfil: [""],
      latitud: [null],
      longitud: [null],
      estado: [{ id: null }],
      flagEvidencia: ["N"]
    });
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['direccionId']) {
      if (this.direccionId) {
        console.log('📩 Nuevo direccionId recibido:', this.direccionId);
        this.cargarDatosDireccion(this.direccionId);
      } else {
        // Reinicia el formulario si no hay direccionId
        this.initForm();
      }
    }
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
    }, { emitEvent: false });
  }



  private cargarUbicaciones() {
    // Cargar todas las regiones al inicio
    this.regionService.buscarTodos().subscribe(regiones => {
      this.regiones = regiones;
      console.log('variable direccion', this.direccionId)
    });

  }

  onRegionSeleccionada(regionId: number) {
    console.log('ID de la región:', regionId);  // Verifica que el ID de la región es válido
    if (regionId) {
      // Resetear provincia y comuna cuando cambia la región
      this.form.patchValue({ provincia: null, comuna: null });
      // Cargar provincias filtradas por la región seleccionada
      this.provinciaService.buscarTodos(regionId).subscribe(provincias => {
        this.provincias = provincias;

      });
    } else {
      console.error('El ID de la región es inválido:', regionId);
    }
  }

  onProvinciaSeleccionada(provincia: number) {
    // Resetear comuna cuando cambia la provincia
    this.form.patchValue({ comuna: null });
    // Cargar comunas filtradas por la provincia seleccionada
    this.comunaService.buscarTodos(provincia).subscribe(comunas => {
      this.comunas = comunas;
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

  onEnviarFormulario() {
    this.formularioEnviado.emit();  // El formulario se envió correctamente
  }
  cargarTipoDireccion() {
    this.tipoDireccionService.buscarTodos().subscribe(
      (response) => {
        this.tiposDirecciones = response.data;  // Asigna la respuesta de la API al arreglo de tiposDirecciones
      },
      (error) => {
        console.error('Error al cargar los tipos de dirección:', error);  // Maneja cualquier error en la llamada a la API
      }
    );
  }


  // Método que se llama cuando se hace clic en el botón
  onSubmit() {
    if (this.form.valid) {
      console.log("Formulario enviado:", this.form.value);
      // Crear el objeto direccion con la estructura adecuada
      const direccion: Direccion = {
        id: this.form.value.id,
        cliente: this.form.value.cliente,
        descripcion: this.form.value.descripcion,
        calle: this.form.value.calle,
        numeracion: this.form.value.numeracion,
        referencia: this.form.value.referencia,
        comuna: this.form.value.comuna,
        sector: this.form.value.sector,
        contacto: this.form.value.contacto,
        tipoDireccion: this.form.value.tipoDireccion,
        imagenPerfil: this.form.value.imagenPerfil,
        latitud: this.form.value.latitud,
        longitud: this.form.value.longitud,
        estado: this.form.value.estado,
        flagEvidencia: this.form.value.flagEvidencia
      };

      // Llamada al servicio para guardar la dirección
      this.direccion.crear(direccion).subscribe({
        next: (empleado) => {
          console.log('Empleado guardado:', empleado);
          this.toastr.success(this.translate.instant('alertas.toastr.success')); // Mensaje de éxito

          // Emitir el evento de éxito al padre
          this.formularioEnviado.emit();
          // Restablecer el formulario a su estado inicial
          this.form.reset({
            estado: { id: null },  // Asignar valores iniciales
            cliente: null,
            descripcion: "",
            calle: "",
            numeracion: "",
            referencia: "",
            comuna: { id: null },
            sector: { id: null }, // Restablecer sector y zona
            contacto: null,
            tipoDireccion: null,
            imagenPerfil: "",
            latitud: null,
            longitud: null,
            flagEvidencia: ""
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

  // Método para cambiar entre "S" y "N"
  toggleEvidencia(event: MatSlideToggleChange) {
    this.form.patchValue({ flagEvidencia: event.checked ? "S" : "N" });
  }



  onZonaSeleccionada(zonaId: number) {
    console.log('ID de la zona seleccionada:', zonaId); // Verificar el ID de la zona
    if (zonaId) {
      // Resetear el sector cuando cambia la zona
      this.form.patchValue({ sector: { id: null } });
      this.sectorService.buscarTodos(zonaId).subscribe(sectores => {
        this.sectores = sectores;
        //   this.form.get('sector')?.enable(); // Habilitar el campo sector una vez cargados los sectores

      });
    } else {
      console.error('El ID de la zona es inválido:', zonaId);
    }
  }

  cargarZonas() {
    this.zonaService.buscarTodos().subscribe(
      (response) => {
        this.zonas = response;
      },
      (error) => {
        console.error('Error al cargar las zonas:', error);
      }
    );
  }



  private cargarDatosDireccion(direccionId: number) {
    const clienteId = this.id ? parseInt(this.id, 10) : 0;

    this.direccion.buscar(direccionId, clienteId).subscribe({
      next: (direccion: ApiEntityResponse<Direccion>) => {
        if (direccion) {
          console.log('Datos de la dirección recibidos:', direccion);

          this.cargarUbicaciones();
          this.onRegionSeleccionada(16);
          this.onProvinciaSeleccionada(161);
          this.cargarZonas();
          this.onZonaSeleccionada(6);
          this.cargarEstado();
          this.cargarTipoDireccion();

          this.form.patchValue({
            id: direccion.data.id,
            cliente: { id: direccion.data.cliente?.id || null },
            descripcion: direccion.data.descripcion || '',
            calle: direccion.data.calle || '',
            numeracion: direccion.data.numeracion || '',
            referencia: direccion.data.referencia || '',
            comuna: { id: direccion.data.comuna?.id || null, descripcionComuna: direccion.data.comuna?.descripcionComuna || '' },
            sector: { id: direccion.data.sector?.id || null, descripcionSector: direccion.data.sector?.descripcionSector || '' },
            contacto: { id: direccion.data.contacto?.id || null, nombre: direccion.data.contacto?.nombre || '' },
            tipoDireccion: { id: direccion.data.tipoDireccion?.id || null, descripcion: direccion.data.tipoDireccion?.descripcion || '' },
            imagenPerfil: direccion.data.imagenPerfil || '',
            latitud: direccion.data.latitud || null,
            longitud: direccion.data.longitud || null,
            estado: { id: direccion.data.estado?.id || null, descripcion: direccion.data.estado?.descripcion || '' },
            flagEvidencia: direccion.data.flagEvidencia || 'N'
          });






          // Actualizar la posición del mapa si es necesario
          this.currentMarkerPosition = {
            lat: direccion.data.latitud || this.initialPosition.lat,
            lng: direccion.data.longitud || this.initialPosition.lng
          };
        }
      },
      error: (error: any) => {
        console.error("Error al cargar la dirección:", error);
        this.toastr.error("Error al cargar los datos de la dirección.");
      }
    });
  }





}