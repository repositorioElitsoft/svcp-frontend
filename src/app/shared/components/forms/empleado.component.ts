import { AfterViewInit, Component, OnInit, ViewChild, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
import { Empleado } from '../../../core/models/empleado.model';
import { catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UploadImageComponent } from "../upload-image/upload-image/upload-image.component";
import { InformacionPersonalComponent } from '../sub-forms/informacion-personal/informacion-personal.component';
import { DatosContactoComponent } from '../sub-forms/datos-contacto/datos-contacto.component';
import { InformacionLaboralComponent } from '../sub-forms/informacion-laboral/informacion-laboral.component';
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"


@Component({
  selector: 'app-empleado-create-form',
  standalone: true,
  imports: [
    UploadImageComponent,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    TranslateModule,
    MatSelectModule,
    MatOptionModule,
    InformacionPersonalComponent,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule,
    TituloDialogoComponent,
    UploadImageComponent,
    DatosContactoComponent,
    InformacionLaboralComponent
  ],
  templateUrl: `./empleado.component.html`,
  styles: [],
})
export class EmpleadoFormComponent implements AfterViewInit {


  readonly dialogRef = inject(MatDialogRef<EmpleadoFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);
  @ViewChild(MatStepper) stepper!: MatStepper;

  @ViewChild(UploadImageComponent) uploadImageForm!: UploadImageComponent
  @ViewChild(DatosContactoComponent) datosContactosForm!: DatosContactoComponent
  @ViewChild(InformacionLaboralComponent) informacionLaboral!: InformacionLaboralComponent
  @ViewChild(InformacionPersonalComponent) informacionPersonal!: InformacionPersonalComponent

  /*variable-declarations*/

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private translate: TranslateService,
    private toastr: ToastrService,
    /*other-services-injection*/

  ) {

  }
  ngAfterViewInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);

      if (this.datosContactosForm) {
        this.datosContactosForm.patch(this.data.object);
      } else {
        console.error("datosContactosForm no está disponible");
      }

      if (this.informacionLaboral) {
        this.informacionLaboral.patch(this.data.object);
      } else {
        console.error("informacionLaboral no está disponible");
      }

      if (this.informacionPersonal) {
        this.informacionPersonal.patch(this.data.object);
      } else {
        console.error("informacionPersonal no está disponible");
      }
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }
  }

  nextStep() {

    this.stepper.next();

  }

  onSubmit() {

    //this.uploadImageForm.form.value

    this.datosContactosForm.form.value
    this.informacionLaboral.form.value
    this.informacionPersonal.form.value

    const formData = {
      id: this.data?.object?.id ?? null,
      ...this.datosContactosForm.form.value,
      ...this.informacionLaboral.form.value,
      ...this.informacionPersonal.form.value
    };
    console.log("Datos mapeados para enviar:", formData);
    console.log("File:", this.uploadImageForm.selectedFile);


    // Cierra el formulario con los datos correctos
    if (this.esActualizar()) {
      this.empleadoService.actualizar(formData.id, formData).subscribe({
        next: (response) => {
          this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
          this.dialogRef.close(response);
        },
        error: (err: any) => {
          console.error("Error al eliminar elemento:", err);
          this.toastr.error(this.translate.instant(convertErrorMessageToI18(err.message)));
        }
      })

    }
    else {
      this.empleadoService.crear(formData).subscribe({
        next: (response) => {
          this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
          this.dialogRef.close(response);
        },
        error: (err: any) => {
          console.log("Código de error recibido:", err.errorCode); // Verificar qué contiene errorCode
          this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
        }
      });
    }
  }
}