import { CommonModule } from "@angular/common"
import { Component, OnInit, inject, model, ViewChild, AfterViewInit } from "@angular/core"
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
import { UploadImageComponent } from "../upload-image/upload-image/upload-image.component"
import { TipoDocumentoIdentificacion } from "../../../core/enums/tipo-documento-identifcacion.enum"
import { ClienteEnum } from "../../../core/enums/cliente.enum"
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { concatMap, of } from "rxjs"

@Component({
    selector: "app-cliente-crear-form",
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
        UploadImageComponent
    ],
    templateUrl: `./cliente-crear.component.html`,
    styles: [],
})
export class ClienteCrearFormComponent implements OnInit, AfterViewInit {
    form!: FormGroup
    showAdditionalInfo = false
    show = true
    isExpanded = false
    isLoading = false
    title = 'SVCP'

    readonly dialogRef = inject(MatDialogRef<ClienteCrearFormComponent>)
    readonly data = inject<any>(MAT_DIALOG_DATA)
    readonly esActualizar = model(this.data.esActualizar)

    @ViewChild('infoPersonal') informacionPersonal!: InformacionPersonalComponent;
    @ViewChild(UploadImageComponent) uploadImage!: UploadImageComponent;

    /*variable-declarations*/
    tipoCliente: TipoCliente[] = []
    clasificacionCliente: ClasificacionCliente[] = []
    estado: Estado[] = []
    agrupacionComercial: AgrupacionComercial[] = []
    segmentacionCliente: SegmentacionCliente[] = []
    pantallaActual = "datos-generales"

    // Método para validar el formulario de forma segura
    isFormValid(): boolean {
        return this.informacionPersonal?.form?.valid ?? false;
    }

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
            console.log("No se recibió un objeto válido en 'data' o no es actualización")
        }
        /*services-init-call*/
    }

    // Agregar ngAfterViewInit para asegurarnos de que los componentes hijos estén inicializados
    ngAfterViewInit() {
        // Asegurarnos de que informacionPersonal esté inicializado
        if (this.esActualizar() && this.data?.object && this.informacionPersonal) {
            // Si estamos actualizando, pasar los datos al componente hijo
            setTimeout(() => {
                this.informacionPersonal.patch(this.data.object);
            }, 0);
        }
    }

    handleLinkClick(link: string) {
        console.log("Enlace clickeado:", link)
        this.pantallaActual = link
    }

    onSubmit() {
        console.log("Formulario enviado:", this.informacionPersonal?.form);

        if (!this.isFormValid()) {
            console.log("Formulario no válido");
            return;
        }

        this.isLoading = true;
        try {
            // Extraer el dígito verificador si es RUT chileno
            const tipoDocId = this.informacionPersonal?.form?.value?.tipoDocumentoIdentificacion?.id;
            let numeroDoc = this.informacionPersonal?.form?.value?.numeroDocumentoIdentificacion;
            let digitoVer = null;

            if (tipoDocId === TipoDocumentoIdentificacion.RUT) { // Si es RUT chileno
                const rutProcesado = this.procesarRutChileno(numeroDoc);
                numeroDoc = rutProcesado.numero;
                digitoVer = rutProcesado.digitoVerificador;
            }

            const documentoIdentificacion = {
                id: null,
                numero: numeroDoc,
                digitoVerificador: digitoVer,
                tipoDocumentoIdentificacion: this.informacionPersonal?.form?.value?.tipoDocumentoIdentificacion
            };

            const cliente: ClienteCrear = {
                documentoIdentificacion: documentoIdentificacion,
                nombre: this.informacionPersonal?.form?.value?.nombre,
                apellidoPaterno: this.informacionPersonal?.form?.value?.apellidoPaterno,
                apellidoMaterno: this.informacionPersonal?.form?.value?.apellidoMaterno,
                estado: this.informacionPersonal?.form?.value?.estado,
                fechaNacimiento: this.informacionPersonal?.form?.value?.fechaNacimiento,
                tipoCliente: { id: ClienteEnum.TIPO_CLIENTE_INDEFINIDO, nombre: "" },
                clasificacionCliente: { id: ClienteEnum.CLASIFICACION_CLIENTE_INDEFINIDA, clasificacionClienteDesc: "" },
                agrupacionComercial: { id: ClienteEnum.AGRUPACION_COMERCIAL_INDEFINIDA, nombreGrupoComercial: "" },
                segmentacionCliente: { id: ClienteEnum.SEGMENTACION_CLIENTE_INDEFINIDA, descripcion: "" },
            }

            this.clienteService.crear(cliente as any).pipe(
                concatMap((clienteCreado: ApiEntityResponse<Cliente>) => {
                    if (this.uploadImage && this.uploadImage.selectedFile) {
                        return this.clienteService.subirImagen(clienteCreado.data.id, this.uploadImage.selectedFile);
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
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
            this.isLoading = false;
            this.toastr.error(this.translate.instant('alertas.toastr.guardar.error'));
        }
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

