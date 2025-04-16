import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicioService } from '../../../core/services/servicio.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';
import { Estado } from '../../../core/models/estado.model';
import { TipoServicio } from '../../../core/models/tipo-servicio.model';
import { ServicioTrabajo } from '../../../core/models/servicio-trabajo.model';
import { TipoServicioService } from '../../../core/services/tipo-servicio.service';

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
import { Servicio } from '../../../core/models/servicio.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-servicio-create-form',
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
    templateUrl: `./servicio.component.html`,
    styles: [],
})
export class ServicioFormComponent implements OnInit {
    form!: FormGroup;
    tiposServicio: TipoServicio[] = [];

    readonly dialogRef = inject(MatDialogRef<ServicioFormComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly esActualizar = model(this.data.esActualizar);

    constructor(
        private fb: FormBuilder,
        private servicioService: ServicioService,
        private tipoServicioService: TipoServicioService,
        private translate: TranslateService,
        private toastr: ToastrService,
    ) {
        this.form = this.fb.group({
            id: [null],
            descripcion: [null, Validators.required],
            tipoServicioId: [null, Validators.required],
        });
    }

    ngOnInit() {
        console.log("Datos recibidos en el formulario:", this.data);

        // Cargar tipos de servicio
        this.tipoServicioService.buscarTodos().subscribe({
            next: (response) => {
                this.tiposServicio = response.data;
                console.log("Tipos de servicio cargados:", this.tiposServicio);
            },
            error: (error) => {
                const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                this.toastr.error(errorMessage);
            }
        });

        if (this.esActualizar() && this.data?.object) {
            console.log("Objeto recibido:", this.data.object);

            this.form.patchValue({
                id: this.data.object.id,
                descripcion: this.data.object.descripcion,
                tipoServicioId: this.data.object.tipoServicio?.id
            });

            console.log("Datos en el formulario después de patchValue:", this.form.value);
        } else {
            console.error("No se recibió un objeto válido en 'data'");
        }
    }

    onSubmit() {
        console.log("Formulario enviado:", this.form.value);
        if (this.form.valid) {
            const formData: Servicio = {
                id: this.form.value.id,
                descripcion: this.form.value.descripcion,
                estado: { id: 1, descripcion: 'Activo' } as Estado,
                tipoServicio: { id: this.form.value.tipoServicioId } as TipoServicio
            };

            console.log("Datos mapeados para enviar:", formData);

            if (this.esActualizar()) {
                this.servicioService.actualizar(formData.id!, formData).subscribe({
                    next: () => {
                        this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                        this.dialogRef.close(true);
                    },
                    error: (error) => {
                        const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                        this.toastr.error(errorMessage);
                    }
                })
            }
            else {
                this.servicioService.crear(formData).subscribe({
                    next: () => {
                        this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
                        this.dialogRef.close(true);
                    },
                    error: (error) => {
                        const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                        this.toastr.error(errorMessage);
                    }
                })
            }
        } else {
            console.log("Formulario no válido");
        }
    }
} 