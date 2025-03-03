import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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

@Component({
  selector: 'app-empleado-create-form',
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
  templateUrl: `./empleado.component.html`,
  styles: [],
})
export class EmpleadoFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<EmpleadoFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  /*variable-declarations*/



  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private translate: TranslateService,
    private toastr: ToastrService,
    /*other-services-injection*/

  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
      /*inputsflag*/
      id: [null,],
      nombre: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null, Validators.required],
      imagenPerfil: [null, Validators.required],
      telefonoFijo: [null, Validators.required],
      telefonoMovil: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],
      email: [null, Validators.required],
      rut: [null, Validators.required],
      rutDv: [null, Validators.required],
      nombreUsuario: [null, Validators.required],
      tipoEmpleadoId: [null, Validators.required],
      roleId: [null, Validators.required],
      estadoId: [null, Validators.required],
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'descripcionEmpleado'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
        /*object-fields-edit*/
        id: this.data.object.id,
        nombre: this.data.object.nombre,
        apellidoPaterno: this.data.object.apellidoPaterno,
        apellidoMaterno: this.data.object.apellidoMaterno,
        imagenPerfil: this.data.object.imagenPerfil,
        telefonoFijo: this.data.object.telefonoFijo,
        telefonoMovil: this.data.object.telefonoMovil,
        fechaNacimiento: this.data.object.fechaNacimiento,
        email: this.data.object.email,
        rut: this.data.object.rut,
        rutDv: this.data.object.rutDv,
        nombreUsuario: this.data.object.nombreUsuario,
        tipoEmpleadoId: this.data.object.tipoEmpleadoId,
        roleId: this.data.object.roleId,
        estadoId: this.data.object.estadoId,
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
      const formData: Empleado = {
        /*form-fields-submit*/
        id: this.form.value.id,
        nombre: this.form.value.nombre,
        apellidoPaterno: this.form.value.apellidoPaterno,
        apellidoMaterno: this.form.value.apellidoMaterno,
        imagenPerfil: this.form.value.imagenPerfil,
        telefonoFijo: this.form.value.telefonoFijo,
        telefonoMovil: this.form.value.telefonoMovil,
        fechaNacimiento: this.form.value.fechaNacimiento,
        email: this.form.value.email,
        rut: this.form.value.rut,
        rutDv: this.form.value.rutDv,
        nombreUsuario: this.form.value.nombreUsuario,
        tipoEmpleadoId: this.form.value.tipoEmpleadoId,
        roleId: this.form.value.roleId,
        estadoId: this.form.value.estadoId,
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      if (this.esActualizar()) {
        this.empleadoService.actualizar(formData.id, formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
            this.dialogRef.close(response);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
            this.toastr.error(errorMessage);
          }
        })

      }
      else {
        this.empleadoService.crear(formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
            this.dialogRef.close(response);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
            this.toastr.error(errorMessage);
          }
        })
      }
    } else {
      console.log("Formulario no válido");
    }
  }
}