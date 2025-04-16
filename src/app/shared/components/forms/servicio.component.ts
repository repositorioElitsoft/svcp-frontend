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
import { forkJoin } from 'rxjs';

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
    tipoServicioSeleccionado: number | null = null;
    isLoading = true;

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

        // Guardar el ID del tipo de servicio si estamos en modo edición
        if (this.esActualizar() && this.data?.object?.tipoServicio?.id) {
            this.tipoServicioSeleccionado = this.data.object.tipoServicio.id;
            console.log("ID del tipo de servicio a precargar:", this.tipoServicioSeleccionado);
        }

        // Cargar tipos de servicio
        this.tipoServicioService.buscarTodos().subscribe({
            next: (response) => {
                this.tiposServicio = response.data;
                console.log("Tipos de servicio cargados:", this.tiposServicio);

                // Después de cargar los tipos de servicio, establecer el valor en el formulario
                if (this.esActualizar() && this.data?.object) {
                    // Asegurarse de que el tipo de servicio existe en la lista
                    const tipoServicioExiste = this.tiposServicio.some(t => t.id === this.tipoServicioSeleccionado);

                    if (tipoServicioExiste) {
                        this.form.patchValue({
                            id: this.data.object.id,
                            descripcion: this.data.object.descripcion,
                            tipoServicioId: this.tipoServicioSeleccionado
                        });
                        console.log("Formulario actualizado con tipo de servicio:", this.form.value);
                    } else {
                        console.error("El tipo de servicio seleccionado no existe en la lista:", this.tipoServicioSeleccionado);
                        this.toastr.error(this.translate.instant('mantenedores.formularios.tipoServicio.noEncontrado'));
                    }
                }

                this.isLoading = false;
            },
            error: (error) => {
                const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                this.toastr.error(errorMessage);
                this.isLoading = false;
            }
        });

        // Si no estamos en modo edición, solo establecer la descripción
        if (!this.esActualizar() && this.data?.object) {
            this.form.patchValue({
                descripcion: this.data.object.descripcion
            });
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