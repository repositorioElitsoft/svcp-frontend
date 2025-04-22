import { Component, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { UploadImageComponent } from '../../upload-image/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from '../../titulo-dialogo/titulo-dialogo.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TipoDocumentoIdentificacion } from '../../../../core/models/tipo-documento-identificacion.model';
import { TipoDocumentoIdentificacionService } from '../../../../core/services/tipo-documento-identificacion.service';
import { EstadoService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estados.model';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';
import { TipoDocumentoIdentificacion as TipoDocumentoIdentificacionEnum } from '../../../../core/enums/tipo-documento-identifcacion.enum';
import { ClienteEnum } from '../../../../core/enums/cliente.enum';
import { ClienteCrear } from '../../../../core/models/cliente.model';

@Component({
  selector: 'app-informacion-personal',
  standalone: true,
  imports: [
    UploadImageComponent,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatStepperModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatError,
    TranslateModule,
    MatFormFieldModule,
    TituloDialogoComponent,
  ],
  templateUrl: './informacion-personal.component.html',
  styleUrl: './informacion-personal.component.css'
})
export class InformacionPersonalComponent {
  form!: FormGroup;

  @Output() clienteActualizado = new EventEmitter<any>();
  @Input() clienteOriginal: any;

  tiposDocumentos: TipoDocumentoIdentificacion[] = [];
  estados: Estado[] = [];
  valueToPatch: any;


  constructor(
    private fb: FormBuilder,
    private estadoService: EstadoService,
    private tipoDocumentoIdentificacionesService: TipoDocumentoIdentificacionService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nombre: [null, [Validators.required, this.noSpecialCharsValidator()]],
      apellidoPaterno: [null, [Validators.required, this.noSpecialCharsValidator()]],
      apellidoMaterno: [null, [Validators.required, this.noSpecialCharsValidator()]],
      tipoDocumentoIdentificacion: [null, Validators.required],
      numeroDocumentoIdentificacion: [null, Validators.required],
      estado: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],
    });

    this.estadoService.buscarTodos().subscribe({
      next: (estados: ApiEntityResponse<Estado[]>) => {
        console.log('Estados cargados:', estados);
        this.estados = estados.data;
        const findEstado = this.estados.find(e => e.id === this.valueToPatch.estado.id);
        this.form.get("estado")?.setValue(findEstado);
      },
      error: (error: any) => {
        console.error("Fallo al buscar entidades ", error);
      }
    });
    // Cargar los tipos de documentos
    this.tipoDocumentoIdentificacionesService.buscarTodos().subscribe({
      next: (tipos: ApiEntityResponse<TipoDocumentoIdentificacion[]>) => {
        console.log('Tipos de documentos cargados:', tipos);
        this.tiposDocumentos = tipos.data as any;
        //console.log('Tipos de documentos cargados:', this.tiposDocumentos);
        const findTipoDocumento = this.tiposDocumentos.find(e => e.id === this.valueToPatch.documentoIdentificacion.tipoDocumentoIdentificacion.id);

        this.form.get('numeroDocumentoIdentificacion')?.patchValue(this.getNumeroIdentificacion())
        this.form.get("tipoDocumentoIdentificacion")?.setValue(findTipoDocumento);
      },
      error: (error: any) => {
        console.error("Fallo al buscar entidades ", error);
      }
    });
  }

  getNumeroIdentificacion() {
    if (!this.valueToPatch || !this.valueToPatch.documentoIdentificacion) {
      return "";
    }

    // Verificar si el tipo de documento es RUT (ID = 1)
    if (this.valueToPatch.documentoIdentificacion.tipoDocumentoIdentificacion.id === 1) {
      const numero = this.valueToPatch.documentoIdentificacion.numero;
      const digitoVerificador = this.valueToPatch.documentoIdentificacion.digitoVerificador;

      // Formato RUT: numero-digitoVerificador
      return `${numero}-${digitoVerificador}`;
    }

    // Para otros tipos de documento, devolver solo el número
    return this.valueToPatch.documentoIdentificacion.numero;
  }

  patch(value: any) {
    this.form.patchValue(value);
    this.valueToPatch = value;
    this.clienteOriginal = value;
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

  prepararClienteParaActualizar(): any {
    if (!this.form.valid) {
      return null;
    }

    // Extraer el dígito verificador si es RUT chileno
    const tipoDocId = this.form.value.tipoDocumentoIdentificacion?.id;
    let numeroDoc = this.form.value.numeroDocumentoIdentificacion;
    let digitoVer = null;

    if (tipoDocId === TipoDocumentoIdentificacionEnum.RUT) { // Si es RUT chileno
      const rutProcesado = this.procesarRutChileno(numeroDoc);
      numeroDoc = rutProcesado.numero;
      digitoVer = rutProcesado.digitoVerificador;
    }

    const documentoIdentificacion = {
      id: this.clienteOriginal.documentoIdentificacion.id,
      numero: numeroDoc,
      digitoVerificador: digitoVer,
      tipoDocumentoIdentificacion: this.form.value.tipoDocumentoIdentificacion
    };

    const cliente: ClienteCrear = {
      documentoIdentificacion: documentoIdentificacion,
      nombre: this.form.value.nombre,
      apellidoPaterno: this.form.value.apellidoPaterno,
      apellidoMaterno: this.form.value.apellidoMaterno,
      estado: this.form.value.estado,
      fechaNacimiento: this.form.value.fechaNacimiento,
      tipoCliente: { id: ClienteEnum.TIPO_CLIENTE_INDEFINIDO, nombre: "" },
      clasificacionCliente: { id: ClienteEnum.CLASIFICACION_CLIENTE_INDEFINIDA, clasificacionClienteDesc: "" },
      agrupacionComercial: { id: ClienteEnum.AGRUPACION_COMERCIAL_INDEFINIDA, nombreGrupoComercial: "" },
      segmentacionCliente: { id: ClienteEnum.SEGMENTACION_CLIENTE_INDEFINIDA, descripcion: "" },
    }

    const clienteActualizar = {
      ...this.clienteOriginal,  // Primero copiamos todos los campos del objeto original
      ...cliente,           // Luego sobreescribimos con los valores nuevos del cliente
      id: this.clienteOriginal.id  // Aseguramos que el ID sea el original
    }

    return clienteActualizar;
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const clienteActualizar = this.prepararClienteParaActualizar();
      if (clienteActualizar) {
        this.clienteActualizado.emit(clienteActualizar);
      }
    } else {
      console.log("Formulario no válido");
    }
  }

  /**
   * Validator para evitar caracteres especiales de programación y números en nombres y apellidos
   */
  noSpecialCharsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      // Regex que permite letras, espacios y caracteres acentuados comunes en nombres
      // pero excluye números y caracteres especiales de programación
      const pattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']+$/;

      const valid = pattern.test(control.value);
      return valid ? null : { 'specialChars': { value: control.value } };
    };
  }
}
