import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';
/*services-imports*/



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
import { catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Rutas } from '../../../core/models/rutas.model';
import { RutaService } from '../../../core/services/rutas.service';

@Component({
  selector: 'app-ruta-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    MatSelectModule,
    MatOptionModule,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule,
    TituloDialogoComponent,
  ],
  templateUrl: `./ruta.component.html`,
  styles: [],
})
export class RutaFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<RutaFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  /*variable-declarations*/



  constructor(
    private fb: FormBuilder,
    private rutaService: RutaService,
    private translate: TranslateService,
    private toastr: ToastrService,
    /*other-services-injection*/

  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
      /*inputsflag*/
      id: [null,],
      descripcion: [null, Validators.required],
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'descripcion'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
        /*object-fields-edit*/
        id: this.data.object.id,
        descripcion: this.data.object.descripcion,
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }
    /*services-init-call*/


  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: Rutas = {
        /*form-fields-submit*/
        id: this.form.value.id,
        descripcion: this.form.value.descripcion,
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      if (this.esActualizar()) {
        this.rutaService.actualizar(formData.id, formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
            this.dialogRef.close(true);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error.message));
            this.toastr.error(errorMessage);
          }
        })

      }
      else {
        this.rutaService.crear(formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
            this.dialogRef.close(true);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error.message));
            this.toastr.error(errorMessage);
          }
        })
      }
    } else {
      console.log("Formulario no válido");
    }
  }
}