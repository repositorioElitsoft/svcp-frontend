import { CommonModule } from "@angular/common"
import { Component, OnInit, inject, model } from "@angular/core"
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatOptionModule } from "@angular/material/core"
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatFormFieldModule, MatError } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { ToastrService } from "ngx-toastr"
import { AgrupacionComercial } from "../../../core/models/agrupacion-comercial.model"
import { ApiEntityResponse } from "../../../core/models/api-entity-response.model"
import { ClasificacionCliente } from "../../../core/models/clasificacion-cliente.model"
import { Cliente } from "../../../core/models/cliente.model"
import { Estado } from "../../../core/models/estados.model"
import { SegmentacionCliente } from "../../../core/models/segmentacion-cliente.model"
import { TipoCliente } from "../../../core/models/tipo-cliente.model"
import { AgrupacionComercialService } from "../../../core/services/agrupacion-comercial.service"
import { ClasificacionClienteService } from "../../../core/services/clasificacion-cliente.service"
import { ClienteService } from "../../../core/services/cliente.service"
import { EstadoService } from "../../../core/services/estado.service"
import { SegmentacionClienteService } from "../../../core/services/segmentacion-cliente.service"
import { TipoClienteService } from "../../../core/services/tipo-cliente.service"
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component"
import { InformacionPersonalComponent } from "../sub-forms/informacion-personal/informacion-personal.component"
import { SidebarItemLinkComponent } from "../sidebar/sidebar-item-link/sidebar-item-link.component"
import { SidebarComponent } from "../sidebar/sidebar.component"

@Component({
  selector: "app-cliente-create-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    MatSelectModule,
    MatOptionModule,
    MatDialogActions,
    MatDialogClose,
    MatError,
    MatIconModule,
    TranslateModule,
    TituloDialogoComponent,
    InformacionPersonalComponent,
    SidebarItemLinkComponent,
    SidebarComponent
  ],
  templateUrl: `./cliente.component.html`,
  styles: [],
})
export class ClienteFormComponent implements OnInit {
  form!: FormGroup
  showAdditionalInfo = false
  show = true
  isExpanded = false

  title = 'SVCP'

  readonly dialogRef = inject(MatDialogRef<ClienteFormComponent>)
  readonly data = inject<any>(MAT_DIALOG_DATA)
  readonly esActualizar = model(this.data.esActualizar)

  /*variable-declarations*/
  tipoCliente: TipoCliente[] = []
  clasificacionCliente: ClasificacionCliente[] = []
  estado: Estado[] = []
  agrupacionComercial: AgrupacionComercial[] = []
  segmentacionCliente: SegmentacionCliente[] = []

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private translate: TranslateService,
    private toastr: ToastrService,
    /*other-services-injection*/
    private tipoClienteService: TipoClienteService,
    private clasificacionClienteService: ClasificacionClienteService,
    private estadoService: EstadoService,
    private agrupacionComercialService: AgrupacionComercialService,
    private segmentacionClienteService: SegmentacionClienteService,
  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
      /*inputsflag*/
      id: [null],
      nombre: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null, Validators.required],
      rut: [null, Validators.required],
      rutDv: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],
      imagenPerfil: [null, Validators.required],
      email: [null, Validators.required],
      campo1: [null, Validators.required],
      campo2: [null, Validators.required],
      telefonoFijo: [null, Validators.required],
      telefonoMovil: [null, Validators.required],
      tipoCliente: [{}, Validators.required],
      clasificacionCliente: [{}, Validators.required],
      estado: [{}, Validators.required],
      direcciones: [null, Validators.required],
      agrupacionComercial: [{}, Validators.required],
      segmentacionCliente: [{}, Validators.required],
    })
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data)

    // Verificar si 'data.object' existe y tiene el campo 'descripcionCliente'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object)

      this.form.patchValue({
        /*object-fields-edit*/
        id: this.data.object.id,
        nombre: this.data.object.nombre,
        apellidoPaterno: this.data.object.apellidoPaterno,
        apellidoMaterno: this.data.object.apellidoMaterno,
        rut: this.data.object.rut,
        rutDv: this.data.object.rutDv,
        fechaNacimiento: this.data.object.fechaNacimiento,
        imagenPerfil: this.data.object.imagenPerfil,
        email: this.data.object.email,
        campo1: this.data.object.campo1,
        campo2: this.data.object.campo2,
        telefonoFijo: this.data.object.telefonoFijo,
        telefonoMovil: this.data.object.telefonoMovil,
        tipoCliente: this.data.object.tipoCliente,
        clasificacionCliente: this.data.object.clasificacionCliente,
        estado: this.data.object.estado,
        direcciones: this.data.object.direcciones,
        agrupacionComercial: this.data.object.agrupacionComercial,
        segmentacionCliente: this.data.object.segmentacionCliente,
      })

      console.log("Datos en el formulario después de patchValue:", this.form.value)
    } else {
      console.error("No se recibió un objeto válido en 'data'")
    }
    /*services-init-call*/

    this.tipoClienteService.buscarTodos().subscribe({
      next: (response: ApiEntityResponse<TipoCliente[]>) => {
        console.log("created entity ", response.data)
        this.tipoCliente = response.data
      },
    })

    this.clasificacionClienteService.buscarTodos().subscribe({
      next: (clasificacionCliente: ClasificacionCliente[]) => {
        console.log("created entity ", clasificacionCliente)
        this.clasificacionCliente = clasificacionCliente
      },
    })

    this.estadoService.buscarTodos().subscribe({
      next: (estado: Estado[]) => {
        console.log("created entity ", estado)
        this.estado = estado
      },
    })

    this.agrupacionComercialService.buscarTodos().subscribe({
      next: (response: ApiEntityResponse<AgrupacionComercial[]>) => {
        console.log("created entity ", response.data)
        this.agrupacionComercial = response.data
      },
    })

    this.segmentacionClienteService.buscarTodos().subscribe({
      next: (segmentacionCliente: SegmentacionCliente[]) => {
        console.log("created entity ", segmentacionCliente)
        this.segmentacionCliente = segmentacionCliente
      },
    })
  }

  handleLinkClick(link: string) {
    console.log("Enlace clickeado:", link)
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value)

    if (this.form.valid) {
      const formData: Cliente = {
        /*form-fields-submit*/
        id: this.form.value.id,
        nombre: this.form.value.nombre,
        apellidoPaterno: this.form.value.apellidoPaterno,
        apellidoMaterno: this.form.value.apellidoMaterno,
        rut: this.form.value.rut,
        rutDv: this.form.value.rutDv,
        fechaNacimiento: this.form.value.fechaNacimiento,
        imagenPerfil: this.form.value.imagenPerfil,
        email: this.form.value.email,
        campo1: this.form.value.campo1,
        campo2: this.form.value.campo2,
        telefonoFijo: this.form.value.telefonoFijo,
        telefonoMovil: this.form.value.telefonoMovil,
        tipoCliente: this.form.value.tipoCliente,
        clasificacionCliente: this.form.value.clasificacionCliente,
        estado: this.form.value.estado,
        direcciones: this.form.value.direcciones,
        agrupacionComercial: this.form.value.agrupacionComercial,
        segmentacionCliente: this.form.value.segmentacionCliente,
      }

      console.log("Datos mapeados para enviar:", formData)

      // Cierra el formulario con los datos correctos
      if (this.esActualizar()) {
        this.clienteService.actualizar(formData.id, formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant("mantenedores.formularios.toastr.success"))
            this.dialogRef.close(response)
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant("mantenedores.formularios.toastr.error")
            this.toastr.error(errorMessage)
          },
        })
      } else {
        this.clienteService.crear(formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant("mantenedores.formularios.toastr.success"))
            this.dialogRef.close(response)
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant("mantenedores.formularios.toastr.error")
            this.toastr.error(errorMessage)
          },
        })
      }
    } else {
      console.log("Formulario no válido")
    }
  }
}

