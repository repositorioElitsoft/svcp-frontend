import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { Cliente } from "../../../../../core/models/cliente.model"
import { Comuna } from "../../../../../core/models/comuna.models"
import { Direccion } from "../../../../../core/models/direccion.model"
import { Estado } from "../../../../../core/models/estado.model"
import { Sector } from "../../../../../core/models/sector.model"
import { TipoDireccion } from "../../../../../core/models/tipo-direccion.model"
import { SectorService } from "../../../../../core/services/sector.service"
import { LocacionFormComponent } from "./locacion-form/locacion-form.component"
import { Contacto } from "../../../../../core/models/contacto.model"
import { MapaComponent } from "./mapa/mapa.component"
import { ContactoComponent } from "../contacto/contacto.component"
import { TipoDireccionService } from "../../../../../core/services/tipo-direccion.service"
import { ComunaService } from "../../../../../core/services/comuna.service"
import { DireccionService } from "../../../../../core/services/direccion.service"



@Component({
  selector: "app-locaciones",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LocacionFormComponent,
    MapaComponent,
    ContactoComponent,
  ],
  templateUrl: "./locaciones.component.html",
  styleUrls: ["./locaciones.component.css"],
})
export class LocacionesComponent implements OnInit {
  direccion: Direccion = {
    id: 0,
    cliente: {} as Cliente,
    descripcionDireccion: "",
    calle: "",
    numeracion: "",
    referencia: "",
    comuna: {} as Comuna,
    sector: {} as Sector,
    contacto: {} as Contacto,
    tipoDireccion: {} as TipoDireccion,
    estado: {} as Estado,
    latitud: 0,
    longitud: 0,
  }

  comunas: Comuna[] = []
  sectores: Sector[] = []
  tiposDireccion: TipoDireccion[] = []
  contactos: Contacto[] = []

  constructor(
    private direccionService: DireccionService,
    private comunaService: ComunaService,
    private sectorService: SectorService,
    private tipoDireccionService: TipoDireccionService,
  ) { }

  ngOnInit(): void {
    this.cargarDatos()
  }

  cargarDatos(): void {
    this.comunaService.buscarTodos().subscribe((comunas: Comuna[]) => {
      this.comunas = comunas
    })

    this.tipoDireccionService.buscarTodos().subscribe((tipos: TipoDireccion[]) => {
      this.tiposDireccion = tipos
    })
  }

  onComunaChange(comunaId: number): void {
    this.sectorService.buscar(comunaId).subscribe((sector: Sector) => {
      this.sectores = [sector]
    })
  }

  onMapaUbicacionChange(ubicacion: { latitud: number; longitud: number; direccion: string; comuna: string }): void {
    this.direccion.latitud = ubicacion.latitud
    this.direccion.longitud = ubicacion.longitud
    this.direccion.calle = ubicacion.direccion

    // Buscar la comuna por nombre y asignarla
    const comunaEncontrada = this.comunas.find((c) => c.descripcionComuna === ubicacion.comuna)
    if (comunaEncontrada) {
      this.direccion.comuna = comunaEncontrada
      this.onComunaChange(comunaEncontrada.id)
    }
  }

  onDireccionChange(direccion: Partial<Direccion>): void {
    this.direccion = { ...this.direccion, ...direccion }
  }

  onContactoChange(contacto: Contacto): void {
    this.direccion.contacto = contacto
  }

  agregarContacto(contacto: Contacto): void {
    this.contactos.push(contacto)
  }

  guardarLocacion(): void {
    this.direccionService.crear(this.direccion).subscribe(
      (response: any) => {
        console.log("Dirección guardada con éxito", response)
        // Aquí puedes agregar lógica para navegar a la siguiente pantalla o mostrar un mensaje
      },
      (error: any) => {
        console.error("Error al guardar la dirección", error)
      },
    )
  }

  cancelar(): void {
    // Lógica para cancelar y volver atrás
  }

  siguiente(): void {
    this.guardarLocacion()
    // Navegar a la siguiente pantalla
  }
}

