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
import { EstadoService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estados.model';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';


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
  estados: Estado[] = [];
  constructor(
    private fb: FormBuilder,
    private estadoService: EstadoService,
    private tipoDocumentoIdentificacionesService: TipoDocumentoIdentificacionService) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null, Validators.required],
      tipoDocumentoIdentificacion: [null, Validators.required],
      numeroDocumentoIdentificacion: [null, Validators.required],
      estado: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],
    });

    this.estadoService.buscarTodos().subscribe({
      next: (estados: ApiEntityResponse<Estado[]>) => {
        console.log('Estados cargados:', estados);
        this.estados = estados.data;
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
