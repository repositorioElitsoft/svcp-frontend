import { Component } from '@angular/core';
import { UploadImageComponent } from '../../upload-image/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  tiposDocumentos: TipoDocumentoIdentificacion[] = [];

  constructor(
    private fb: FormBuilder,
    private tipoDocumentoIdentificacionesService: TipoDocumentoIdentificacionService) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null, Validators.required],
      documentoIdentificacion: this.fb.group({
        id: [null],
        numero: [null, Validators.required],
        digitoVerificador: [null],
        tipoDocumentoIdentificacion: [null, Validators.required], // Cambiado a solo 'id'
      }),
      fechaNacimiento: [null, Validators.required],
    });

    // Cargar los tipos de documentos
    this.tipoDocumentoIdentificacionesService.buscarTodos().subscribe({
      next: (tipos: TipoDocumentoIdentificacion[]) => {
        this.tiposDocumentos = tipos;
        console.log('Tipos de documentos cargados:', this.tiposDocumentos);
      },
      error: (error: any) => {
        console.error("Fallo al buscar entidades ", error);
      }
    });
  }

  patch(value: any) {
    this.form.patchValue(value)
  }
}
