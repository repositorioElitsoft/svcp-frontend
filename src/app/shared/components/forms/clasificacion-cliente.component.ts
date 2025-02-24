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
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component";

/*modelsImports*/

@Component({
  selector: 'app-clasificacionCliente-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule,
    TituloDialogoComponent,
  ],
  templateUrl: `./clasificacion-cliente.component.html`,
  styles: [],
})
export class ClasificacionClienteFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<ClasificacionClienteFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  constructor(
    private fb: FormBuilder,
    private clasificacionClienteService: ClasificacionClienteService
  ) {
    this.form = this.fb.group({
      id: [null],
      clasificacionClienteDesc: [
        this.data?.object?.clasificacionClienteDesc || 'Sin descripción', // Valor predeterminado actualizado
        Validators.required,
      ], // Valor predeterminado
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'clasificacionClienteDesc'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);

      // Si 'clasificacionClienteDesc' es null o vacío, se maneja con 'Sin descripción'
      const clasificacionClienteDesc = this.data.object.clasificacionClienteDesc || 'Sin descripción';

      // Verificar si 'id' está presente y no es null
      const id = this.data.object.id !== null ? this.data.object.id : null; // Asignar null si no existe

      // Aplicar valores a través de patchValue
      this.form.patchValue({
        id: id,
        clasificacionClienteDesc: clasificacionClienteDesc,
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData = {
        id: this.form.value.id,
        clasificacionClienteDesc: this.form.value.clasificacionClienteDesc, // Asegúrate de que este sea el campo correcto
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      this.dialogRef.close(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
