import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoProductoService } from '../../../core/services/tipo-producto.service';
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
import { TipoProducto } from '../../../core/models/tipo-producto.model';

@Component({
  selector: 'app-tipoProducto-create-form',
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
  templateUrl: `./tipo-producto.component.html`,
  styles: [],
})
export class TipoProductoFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<TipoProductoFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  

  constructor(
    private fb: FormBuilder,
    private tipoProductoService: TipoProductoService,
    
  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
       id: [null, Validators.required],
  descripcionTipoProducto: [null, Validators.required],
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'tipoProductoDesc'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
       id: this.data.object.id,
descripcionTipoProducto: this.data.object.descripcionTipoProducto,
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }

    
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: TipoProducto = {
       id: this.form.value.id,
descripcionTipoProducto: this.form.value.descripcionTipoProducto,
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      this.dialogRef.close(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
