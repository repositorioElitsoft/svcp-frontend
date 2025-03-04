import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SegmentacionClienteService } from '../../../core/services/segmentacion-cliente.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';

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
import { SegmentacionCliente } from '../../../core/models/segmentacion-cliente.model';
import { catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-segmentacion-cliente-create-form',
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
  templateUrl: `./segmentacion-cliente.component.html`,
  styles: [],
})
export class SegmentacionClienteFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<SegmentacionClienteFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  /*variable-declarations*/



  constructor(
    private fb: FormBuilder,
    private segmentacionClienteService: SegmentacionClienteService,
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

    // Verificar si 'data.object' existe y tiene el campo 'descripcionSegmentacionCliente'
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

    if (this.form.invalid) {
      this.toastr.error(this.translate.instant('mantenedores.formularios.toastr.invalid_description'));
      return;
    }

    const formData: SegmentacionCliente = {
      id: this.form.value.id,
      descripcion: this.form.value.descripcionTipoServicio,
    };

    console.log("Datos mapeados para enviar:", formData);

    if (this.esActualizar()) {
      // Llamar al servicio para actualizar
      this.segmentacionClienteService.actualizar(formData.id, formData).subscribe({
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
      this.segmentacionClienteService.crear(formData).subscribe({
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