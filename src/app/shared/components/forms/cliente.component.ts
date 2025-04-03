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
import { InformacionComercialComponent } from "../sub-forms/informacion-comercial/informacion-comercial.component"
import { DatosContactoComponent } from "../sub-forms/datos-contacto/datos-contacto.component"

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
    SidebarComponent,
    InformacionComercialComponent,
    DatosContactoComponent
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
  pantallaActual = "datos-generales"

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data)

    // Verificar si 'data.object' existe y tiene el campo 'descripcionCliente'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object)

      console.log("Datos en el formulario después de patchValue:", this.form.value)
    } else {
      console.error("No se recibió un objeto válido en 'data'")
    }
    /*services-init-call*/

  }

  handleLinkClick(link: string) {
    console.log("Enlace clickeado:", link)
    this.pantallaActual = link
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value)

    if (this.form.valid) {

      // Cierra el formulario con los datos correctos
      if (this.esActualizar()) {

      } else {

      }
    } else {
      console.log("Formulario no válido")
    }
  }
}

