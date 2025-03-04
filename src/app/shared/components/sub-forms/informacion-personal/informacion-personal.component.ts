import { Component } from '@angular/core';
import { UploadImageComponent } from '../../upload-image/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from '../../titulo-dialogo/titulo-dialogo.component';

@Component({
  selector: 'app-informacion-personal',
  standalone: true,
  imports: [
    UploadImageComponent,
    CommonModule,
    ReactiveFormsModule,
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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      /*inputsflag*/
      id: [null,],
      nombre: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null, Validators.required],
      tipoDocumento: [{}, Validators.required],
      numeroDocumento: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],
    });
  }
}
