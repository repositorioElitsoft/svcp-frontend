import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoEmpleadoService } from '../../../core/services/tipo-empleado.service';
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
import { TipoEmpleado } from '../../../core/models/tipo-empleado.model';

@Component({
  selector: 'app-tipoEmpleado-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule,
    TituloDialogoComponent,
  ],
  templateUrl: `./tipo-empleado.component.html`,
  styles: [],
})
export class TipoEmpleadoFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<TipoEmpleadoFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);



  constructor(
    private fb: FormBuilder,
    private tipoEmpleadoService: TipoEmpleadoService,

  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
      id: [null,],
      descripcionTipoEmpleado: [null, Validators.required],
    });
  }

  ngOnInit() {
    if (this.esActualizar() && this.data?.object) {
      this.form.patchValue({
        id: this.data.object.id,
        descripcionTipoEmpleado: this.data.object.descripcionTipoEmpleado,
      });

      // Si estamos editando, hacemos que 'id' sea obligatorio
      this.form.get('id')?.setValidators(Validators.required);
      this.form.get('id')?.updateValueAndValidity();
    }
  }


  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: TipoEmpleado = {
        id: this.form.value.id,
        descripcionTipoEmpleado: this.form.value.descripcionTipoEmpleado,
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      this.dialogRef.close(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
