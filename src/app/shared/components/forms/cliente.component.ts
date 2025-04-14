import { CommonModule } from "@angular/common"
import { Component, OnInit, ViewChild, inject, model } from "@angular/core"
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
import { Cliente, ClienteCrear } from "../../../core/models/cliente.model"
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
import { DireccionEmpleadoComponent } from "../../../features/mantenedores/direccion-empleado/direccion-empleado.component"
import { UploadImageComponent } from "../upload-image/upload-image/upload-image.component"
import { TipoDocumentoIdentificacion } from "../../../core/enums/tipo-documento-identifcacion.enum"
import { ClienteEnum } from "../../../core/enums/cliente.enum"
import { concatMap, of } from "rxjs"
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"

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
    DatosContactoComponent,
    DireccionEmpleadoComponent,
    UploadImageComponent
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
  isLoading = false

  @ViewChild(InformacionPersonalComponent) informacionPersonal!: InformacionPersonalComponent;
  @ViewChild(UploadImageComponent) uploadImage!: UploadImageComponent;
  @ViewChild(InformacionComercialComponent) informacionComercial!: InformacionComercialComponent;
  @ViewChild(DatosContactoComponent) datosContacto!: DatosContactoComponent;

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


    } else {
      console.error("No se recibió un objeto válido en 'data'")
    }
    /*services-init-call*/

  }
  ngAfterViewInit() {
    this.informacionPersonal.patch(this.data.object)

    this.clienteService.descargarImagen(this.data.object.id).subscribe((imagen: File) => {
      console.log("Imagen descargada:")
      this.uploadImage.patch(imagen)
    })
  }

  handleLinkClick(link: string) {
    console.log("Enlace clickeado:", link)
    this.pantallaActual = link
  }

  onSubmit() {

    if (this.pantallaActual === "datos-generales") {
      this.envioFormularioDatosGenerales()
      return
    }
    if (this.pantallaActual === "informacion-comercial") {
      this.envioFormularioInformacionComercial()
      return
    }
    if (this.pantallaActual === "datos-contacto") {
      this.envioFormularioDatosContacto()
      return
    }
    if (this.pantallaActual === "locaciones") {
      this.envioFormularioLocaciones()
      return
    }
  }

  envioFormularioDatosGenerales() {
    console.log("Formulario enviado:", this.informacionPersonal.form.value)

    if (this.informacionPersonal.form.valid) {
      this.isLoading = true;
      // Extraer el dígito verificador si es RUT chileno
      const tipoDocId = this.informacionPersonal.form.value.tipoDocumentoIdentificacion?.id;
      let numeroDoc = this.informacionPersonal.form.value.numeroDocumentoIdentificacion;
      let digitoVer = null;

      if (tipoDocId === TipoDocumentoIdentificacion.RUT) { // Si es RUT chileno
        const rutProcesado = this.procesarRutChileno(numeroDoc);
        numeroDoc = rutProcesado.numero;
        digitoVer = rutProcesado.digitoVerificador;
      }

      const documentoIdentificacion = {
        id: this.data.object.documentoIdentificacion.id,
        numero: numeroDoc,
        digitoVerificador: digitoVer,
        tipoDocumentoIdentificacion: this.informacionPersonal.form.value.tipoDocumentoIdentificacion
      };


      const cliente: ClienteCrear = {
        documentoIdentificacion: documentoIdentificacion,
        nombre: this.informacionPersonal.form.value.nombre,
        apellidoPaterno: this.informacionPersonal.form.value.apellidoPaterno,
        apellidoMaterno: this.informacionPersonal.form.value.apellidoMaterno,
        estado: this.informacionPersonal.form.value.estado,
        fechaNacimiento: this.informacionPersonal.form.value.fechaNacimiento,
        tipoCliente: { id: ClienteEnum.TIPO_CLIENTE_INDEFINIDO, nombre: "" },
        clasificacionCliente: { id: ClienteEnum.CLASIFICACION_CLIENTE_INDEFINIDA, clasificacionClienteDesc: "" },
        agrupacionComercial: { id: ClienteEnum.AGRUPACION_COMERCIAL_INDEFINIDA, nombreGrupoComercial: "" },
        segmentacionCliente: { id: ClienteEnum.SEGMENTACION_CLIENTE_INDEFINIDA, descripcion: "" },
      }

      const clienteActualizar = {
        ...this.data.object,  // Primero copiamos todos los campos del objeto original
        ...cliente,           // Luego sobreescribimos con los valores nuevos del cliente
        id: this.data.object.id  // Aseguramos que el ID sea el original
      }

      console.log("clienteActualizar", clienteActualizar)

      this.clienteService.actualizar(this.data.object.id, clienteActualizar as any).pipe(
        concatMap((clienteCreado: ApiEntityResponse<string>) => {

          if (this.uploadImage && this.uploadImage.selectedFile) {
            return this.clienteService.subirImagen(this.data.object.id, this.uploadImage.selectedFile);
          }
          return of(clienteCreado);
        })
      ).subscribe({
        next: (result: any) => {
          console.log("Operación completada:", result);
          this.isLoading = false;
          this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error("Error en la operación:", error);
          this.isLoading = false;
          const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error.message));
          this.toastr.error(errorMessage);
        }
      });
    } else {
      console.log("Formulario no válido")
    }
  }

  envioFormularioInformacionComercial() {
    console.log("Formulario Información Comercial enviado");

    // Verificar si existe el ViewChild de InformacionComercialComponent
    if (!this.informacionComercial) {
      console.error("Componente de información comercial no inicializado");
      return;
    }

    if (this.informacionComercial.form.valid) {
      this.isLoading = true;

      // Preparar datos del cliente para actualizar
      const clienteActualizar = {
        ...this.data.object,
        tipoCliente: this.informacionComercial.form.value.tipoCliente,
        agrupacionComercial: this.informacionComercial.form.value.agrupacionComercial,
        segmentacionCliente: this.informacionComercial.form.value.segmentacionCliente,
        campoAdicional1: this.informacionComercial.form.value.campoAdicional1,
        campoAdicional2: this.informacionComercial.form.value.campoAdicional2,
        id: this.data.object.id
      };

      console.log("clienteActualizar", clienteActualizar);

      this.clienteService.actualizar(this.data.object.id, clienteActualizar as any).pipe(
        concatMap((clienteActualizado: ApiEntityResponse<string>) => {
          if (this.uploadImage && this.uploadImage.selectedFile) {
            return this.clienteService.subirImagen(this.data.object.id, this.uploadImage.selectedFile);
          }
          return of(clienteActualizado);
        })
      ).subscribe({
        next: (result: any) => {
          console.log("Operación completada:", result);
          this.isLoading = false;
          this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error("Error en la operación:", error);
          this.isLoading = false;
          const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error.message));
          this.toastr.error(errorMessage);
        }
      });
    } else {
      console.log("Formulario no válido");
    }
  }

  envioFormularioDatosContacto() {
    console.log("Formulario Datos de Contacto enviado");

    // Verificar si existe el ViewChild de DatosContactoComponent
    if (!this.datosContacto) {
      console.error("Componente de datos de contacto no inicializado");
      return;
    }

    if (this.datosContacto.form.valid) {
      this.isLoading = true;

      // Preparar datos del cliente para actualizar
      const clienteActualizar = {
        ...this.data.object,
        email: this.datosContacto.form.value.email,
        telefonoFijo: this.datosContacto.form.value.telefonoFijo,
        telefonoMovil: this.datosContacto.form.value.telefonoMovil,
        id: this.data.object.id
      };

      console.log("clienteActualizar", clienteActualizar);

      this.clienteService.actualizar(this.data.object.id, clienteActualizar as any).pipe(
        concatMap((clienteActualizado: ApiEntityResponse<string>) => {
          if (this.uploadImage && this.uploadImage.selectedFile) {
            return this.clienteService.subirImagen(this.data.object.id, this.uploadImage.selectedFile);
          }
          return of(clienteActualizado);
        })
      ).subscribe({
        next: (result: any) => {
          console.log("Operación completada:", result);
          this.isLoading = false;
          this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error("Error en la operación:", error);
          this.isLoading = false;
          const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error.message));
          this.toastr.error(errorMessage);
        }
      });
    } else {
      console.log("Formulario no válido");
    }
  }

  envioFormularioLocaciones() {

  }

  /**
    * Procesa un RUT chileno para separar el número del dígito verificador
    * @param rutCompleto El RUT completo ingresado
    * @returns Objeto con el número y dígito verificador separados
    */
  procesarRutChileno(rutCompleto: string): { numero: string, digitoVerificador: string } {
    // Eliminar puntos y guiones
    let rut = rutCompleto.replace(/\./g, '').replace(/-/g, '').trim();

    // El último carácter es el dígito verificador
    const digitoVerificador = rut.slice(-1);
    // El resto es el número
    const numero = rut.slice(0, -1);

    return {
      numero: numero,
      digitoVerificador: digitoVerificador
    };
  }


}

