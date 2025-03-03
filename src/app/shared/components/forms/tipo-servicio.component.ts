import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoServicioService } from '../../../core/services/tipo-servicio.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';



import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component";
import { TipoServicio } from '../../../core/models/tipo-servicio.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipoServicio-create-form',
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
  templateUrl: `./tipo-servicio.component.html`,
  styles: [],
})
export class TipoServicioFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<TipoServicioFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);



  constructor(
    private translate: TranslateService, private toastr: ToastrService,
    private fb: FormBuilder,
    private tipoServicioService: TipoServicioService,

  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
      id: [null],
      descripcionTipoServicio: [null, Validators.required],
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'tipoServicioDesc'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
        id: this.data.object.id,
        descripcionTipoServicio: this.data.object.descripcionTipoServicio,
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }


  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.invalid) {
      this.toastr.error(this.translate.instant('mantenedores.formularios.toastr.invalid_description'));
      return;
    }

    const formData: TipoServicio = {
      id: this.form.value.id,
      descripcionTipoServicio: this.form.value.descripcionTipoServicio,
    };

    console.log("Datos mapeados para enviar:", formData);

    if (this.esActualizar()) {
      // Llamar al servicio para actualizar
      this.tipoServicioService.actualizar(formData.id, formData).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
          this.dialogRef.close(formData);
        },
        error: (error) => {
          const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
          this.toastr.error(errorMessage);
        }
      });
    } else {
      // Llamar al servicio para crear un nuevo servicio
      this.tipoServicioService.crear(formData).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
          this.dialogRef.close(formData);
        },
        error: (error) => {
          const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
          this.toastr.error(errorMessage);
        }
      });
    }
  }


}
