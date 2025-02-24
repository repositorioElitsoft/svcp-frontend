import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClasificacionClienteService } from '../../../core/services/clasificacion-cliente.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,

} from '@angular/material/dialog';
import { ClasificacionCliente } from '../../../core/models/clasificacion-cliente.model';
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component";

/*modelsImports*/



@Component({
  selector: 'app-clasificacionCliente-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule, TituloDialogoComponent],
  templateUrl: `./clasificacion-cliente.component.html`,
  styles: []
})
export class ClasificacionClienteFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<ClasificacionClienteFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);


  constructor(
    private fb: FormBuilder,
    private clasificacionClienteService: ClasificacionClienteService,

  ) {
    this.form = this.fb.group({
      id: [null, Validators.required],
      descripcionClasificacionCliente: [null, Validators.required],
    });
  }

  ngOnInit() {
    console.log(this.data);  // Verifica qué datos están llegando
    if (this.esActualizar() && this.data.object) {
      this.form.patchValue(this.data.object);
    }
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);  // Verifica los datos del formulario antes de enviar

    if (this.form.valid) {
      const formData = this.form.value as ClasificacionCliente;

      if (!this.esActualizar()) {
        console.log("Creando nueva entidad:", formData);  // Verifica los datos a crear
        this.clasificacionClienteService.crear(formData).subscribe({
          next: (clasificacionCliente: ClasificacionCliente) => {
            console.log("Entidad creada:", clasificacionCliente);
            this.dialogRef.close(clasificacionCliente);  // Cierra el diálogo pasando los datos creados
          },
          error: (error) => {
            console.error("Error al crear entidad:", error);  // Manejo de errores
          }
        });
      } else {
        console.log("Actualizando entidad con ID:", formData.id);  // Verifica los datos a actualizar
        this.clasificacionClienteService.actualizar(formData.id, formData).subscribe({
          next: (clasificacionCliente: ClasificacionCliente) => {
            console.log("Entidad actualizada:", clasificacionCliente);
            this.dialogRef.close(clasificacionCliente);  // Cierra el diálogo pasando los datos actualizados
          },
          error: (error) => {
            console.error("Error al actualizar entidad:", error);  // Manejo de errores
          }
        });
      }
    } else {
      console.log("Formulario no válido");  // Si el formulario no es válido, lo indicamos
    }
  }


}