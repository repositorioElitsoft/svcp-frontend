import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AgrupacionComercialService } from '../../../core/services/agrupacion-comercial.service';
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
import { AgrupacionComercial } from '../../../core/models/agrupacion-comercial.model';

@Component({
  selector: 'app-agrupacionComercial-create-form',
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
  templateUrl: `./agrupacion-comercial.component.html`,
  styles: [],
})
export class AgrupacionComercialFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<AgrupacionComercialFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  

  constructor(
    private fb: FormBuilder,
    private agrupacionComercialService: AgrupacionComercialService,
    
  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
       id: [null, Validators.required],
       nombreGrupoComercial: [
        this.data?.object?.descripcion || '',
        Validators.required,
      ]
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'agrupacionComercialDesc'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
       id: this.data.object.id,
nombreGrupoComercial: this.data.object.nombreGrupoComercial,
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }

    
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: AgrupacionComercial = {
       id: this.form.value.id,
nombreGrupoComercial: this.form.value.nombreGrupoComercial,
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      this.dialogRef.close(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
