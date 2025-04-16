import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

// Servicios
import { ServicioTrabajoService } from '../../../core/services/servicio-trabajo.service';
import { TrabajoService } from '../../../core/services/trabajo.service';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';

// Componentes
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { Trabajo } from '../../../core/models/trabajo.model';
import { ApiEntityResponse } from '../../../core/models/api-entity-response.model';
import { ServicioTrabajo } from '../../../core/models/servicio-trabajo.model';

interface TrabajoAsignado {
    id: number;
    trabajoId: number;
    descripcion: string;
    descripcionTrabajo: string;
    ordenEjecucionTrabajo: number;
}

@Component({
    selector: 'app-servicio-trabajo-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        TituloDialogoComponent,
        DragDropModule
    ],
    templateUrl: './servicio-trabajo.component.html'
})
export class ServicioTrabajoFormComponent implements OnInit, OnDestroy {
    // Formulario
    form!: FormGroup;

    // Datos del servicio
    servicioId: number = 0;
    servicioDescripcion: string = '';
    data: any;

    // Listas
    Trabajos: Trabajo[] = [];
    trabajosAsignados: TrabajoAsignado[] = [];
    trabajosDisponibles: Trabajo[] = [];

    // Control de estado
    isLoading = false;
    ultimoValor: number = 0;
    mostrarTodos: boolean = false;

    // Control de suscripciones
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ServicioTrabajoFormComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private servicioTrabajoService: ServicioTrabajoService,
        private trabajoService: TrabajoService,
        private toastr: ToastrService,
        private translate: TranslateService
    ) {
        console.log('Constructor - Data recibida:', data);
        this.data = data;
        this.inicializarFormulario();
        this.inicializarDatosServicio();
    }

    ngOnInit(): void {
        console.log('ngOnInit - Estado inicial:', {
            servicioId: this.servicioId,
            servicioDescripcion: this.servicioDescripcion,
            trabajosAsignados: this.trabajosAsignados
        });

        if (this.servicioId) {
            this.cargarTrabajos();
        }

        if (this.Trabajos.length > 0) {
            this.actualizarTrabajosDisponibles();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private inicializarFormulario(): void {
        this.form = this.fb.group({
            trabajos: [[], Validators.required]
        });
        console.log('inicializarFormulario - Formulario creado:', this.form.value);
    }

    private inicializarDatosServicio(): void {
        console.log('inicializarDatosServicio - Iniciando con data:', this.data);

        if (this.data?.id) {
            this.servicioId = this.data.id;
            this.servicioDescripcion = this.data.descripcionServicio || '';

            if (Array.isArray(this.data.servicioTrabajos) && this.data.servicioTrabajos.length > 0) {
                console.log('inicializarDatosServicio - ServicioTrabajos recibidos:', this.data.servicioTrabajos);

                this.trabajosAsignados = this.data.servicioTrabajos.map((item: { trabajo: { id: number, descripcionTrabajo: string }, ordenEjecucionTrabajo: number }) => ({
                    id: item.trabajo.id,
                    trabajoId: item.trabajo.id,
                    descripcion: item.trabajo.descripcionTrabajo,
                    descripcionTrabajo: item.trabajo.descripcionTrabajo,
                    ordenEjecucionTrabajo: item.ordenEjecucionTrabajo
                }));

                this.trabajosAsignados.sort((a, b) => a.ordenEjecucionTrabajo - b.ordenEjecucionTrabajo);
                this.ultimoValor = Math.max(...this.data.servicioTrabajos.map((item: any) => item.ordenEjecucionTrabajo || 0));

                console.log('inicializarDatosServicio - Trabajos asignados mapeados:', this.trabajosAsignados);
                console.log('inicializarDatosServicio - Último valor de ordenEjecucionTrabajo:', this.ultimoValor);

                this.form.patchValue({
                    trabajos: this.trabajosAsignados
                });
            }
        } else {
            console.warn('inicializarDatosServicio - No se recibió un objeto válido en data');
        }
    }

    esActualizar(): boolean {
        const servicioTrabajos = this.data?.servicioTrabajos;
        return Array.isArray(servicioTrabajos) && servicioTrabajos.length > 0;
    }

    private cargarTrabajos(): void {
        console.log('cargarTrabajos - Iniciando carga de trabajos');

        this.trabajoService.buscarTodos()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: ApiEntityResponse<Trabajo[]>) => {
                    this.Trabajos = response.data;
                    this.actualizarTrabajosDisponibles();
                    console.log('cargarTrabajos - Trabajos cargados:', this.Trabajos);
                },
                error: (error) => {
                    console.error('cargarTrabajos - Error al cargar trabajos:', error);
                }
            });
    }

    private actualizarTrabajosDisponibles(): void {
        console.log('actualizarTrabajosDisponibles - Iniciando actualización');

        this.trabajosDisponibles = this.Trabajos.filter(trabajo =>
            !this.trabajosAsignados.some(ta => ta.trabajoId === trabajo.id)
        );

        console.log('actualizarTrabajosDisponibles - Trabajos disponibles:', this.trabajosDisponibles);
    }

    onTrabajoDelete(trabajo: TrabajoAsignado): void {
        console.log('onTrabajoDelete - Trabajo a eliminar:', trabajo);

        this.trabajosAsignados = this.trabajosAsignados.filter(t => t.trabajoId !== trabajo.trabajoId);

        this.trabajosAsignados.forEach((t, index) => {
            t.ordenEjecucionTrabajo = index + 1;
        });

        console.log('onTrabajoDelete - Lista actualizada:', this.trabajosAsignados);

        this.form.patchValue({ trabajos: this.trabajosAsignados });
        this.actualizarTrabajosDisponibles();
        this.trabajosAsignados = [...this.trabajosAsignados];
    }

    onTrabajosClear(): void {
        console.log('onTrabajosClear - Limpiando todos los trabajos');

        this.trabajosAsignados = [];
        this.form.patchValue({ trabajos: [] });
        this.actualizarTrabajosDisponibles();
        this.trabajosAsignados = [...this.trabajosAsignados];
    }

    onTrabajoSelect(event: any): void {
        console.log('onTrabajoSelect - Evento recibido:', event);

        if (!event?.value) {
            console.log('onTrabajoSelect - No hay valor en el evento');
            return;
        }

        const trabajoId = event.value;
        const trabajoSeleccionado = this.Trabajos.find(t => t.id === trabajoId);
        console.log('onTrabajoSelect - Trabajo seleccionado:', trabajoSeleccionado);

        if (trabajoSeleccionado?.id) {
            const trabajoYaAsignado = this.trabajosAsignados.some(t => t.trabajoId === trabajoSeleccionado.id);

            if (trabajoYaAsignado) {
                console.log('onTrabajoSelect - Trabajo ya asignado, ignorando');
                this.toastr.warning(this.translate.instant('alertas.toastr.errors.servicioTrabajo.DUPLICADO'));
                return;
            }

            console.log('onTrabajoSelect - Agregando nuevo trabajo');

            const nuevoTrabajoAsignado: TrabajoAsignado = {
                id: trabajoSeleccionado.id,
                trabajoId: trabajoSeleccionado.id,
                descripcion: trabajoSeleccionado.descripcionTrabajo,
                descripcionTrabajo: trabajoSeleccionado.descripcionTrabajo,
                ordenEjecucionTrabajo: this.ultimoValor + 1
            };

            this.trabajosAsignados = [...this.trabajosAsignados, nuevoTrabajoAsignado];
            this.ultimoValor++;

            console.log('onTrabajoSelect - Lista actualizada de trabajos:', this.trabajosAsignados);

            this.form.patchValue({ trabajos: this.trabajosAsignados });
            this.actualizarTrabajosDisponibles();
            this.trabajosAsignados = [...this.trabajosAsignados];
        }
    }

    onDrop(event: CdkDragDrop<TrabajoAsignado[]>): void {
        console.log('onDrop - Evento recibido:', event);

        if (event.previousIndex === event.currentIndex) {
            console.log('onDrop - No hay cambio en el orden');
            return;
        }

        moveItemInArray(this.trabajosAsignados, event.previousIndex, event.currentIndex);

        this.trabajosAsignados.forEach((trabajo, index) => {
            trabajo.ordenEjecucionTrabajo = index + 1;
        });

        console.log('onDrop - Trabajos reordenados:', this.trabajosAsignados);

        this.form.patchValue({ trabajos: this.trabajosAsignados });
        this.trabajosAsignados = [...this.trabajosAsignados];
    }

    async onSubmit(): Promise<void> {
        console.log('onSubmit - Iniciando envío del formulario');
        console.log('onSubmit - Estado del formulario:', {
            valid: this.form.valid,
            value: this.form.value,
            trabajosAsignados: this.trabajosAsignados
        });

        if (this.form.invalid) {
            console.warn('onSubmit - Formulario inválido');
            this.toastr.warning(this.translate.instant('alertas.toastr.camposRequeridos'));
            return;
        }

        this.isLoading = true;
        console.log('onSubmit - Preparando datos para enviar');

        try {
            if (this.esActualizar() && Array.isArray(this.data.servicioTrabajos)) {
                if (this.trabajosAsignados.length === 0) {
                    console.log('onSubmit - No hay trabajos asignados, eliminando todos los existentes');
                    const trabajosParaEliminar = this.data.servicioTrabajos.map((st: any) => ({
                        servicio: {
                            id: this.servicioId
                        },
                        trabajo: {
                            id: st.trabajo.id
                        },
                        ordenEjecucionTrabajo: st.ordenEjecucionTrabajo
                    }));
                    console.log('onSubmit - Trabajos formateados para eliminar:', trabajosParaEliminar);

                    try {
                        await this.servicioTrabajoService.borrarLote(trabajosParaEliminar).toPromise();
                        console.log('onSubmit - Todos los trabajos eliminados exitosamente');
                        this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                        this.dialogRef.close(true);
                        return;
                    } catch (error) {
                        console.error('onSubmit - Error al eliminar trabajos:', error);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                        return;
                    }
                }

                const trabajosEliminados = this.data.servicioTrabajos.filter(
                    (st: any) => !this.trabajosAsignados.some(ta => ta.trabajoId === st.trabajo.id)
                );

                console.log('onSubmit - Trabajos a eliminar:', trabajosEliminados);

                if (trabajosEliminados.length > 0) {
                    const trabajosParaEliminar = trabajosEliminados.map((st: any) => ({
                        servicio: {
                            id: this.servicioId
                        },
                        trabajo: {
                            id: st.trabajo.id
                        },
                        ordenEjecucionTrabajo: st.ordenEjecucionTrabajo
                    }));
                    console.log('onSubmit - Trabajos formateados para eliminar:', trabajosParaEliminar);

                    try {
                        await this.servicioTrabajoService.borrarLote(trabajosParaEliminar).toPromise();
                        console.log('onSubmit - Trabajos eliminados exitosamente');
                    } catch (error) {
                        console.error('onSubmit - Error al eliminar trabajos:', error);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                        return;
                    }
                }

                const trabajosNuevos = this.trabajosAsignados.filter(
                    ta => !this.data.servicioTrabajos.some((st: any) => st.trabajo.id === ta.trabajoId)
                );

                const trabajosReordenados = this.trabajosAsignados.filter(ta => {
                    const trabajoExistente = this.data.servicioTrabajos.find((st: any) => st.trabajo.id === ta.trabajoId);
                    return trabajoExistente && trabajoExistente.ordenEjecucionTrabajo !== ta.ordenEjecucionTrabajo;
                });

                console.log('onSubmit - Trabajos nuevos a agregar:', trabajosNuevos);
                console.log('onSubmit - Trabajos reordenados:', trabajosReordenados);

                if (trabajosNuevos.length === 0 && trabajosReordenados.length === 0) {
                    this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    this.dialogRef.close(true);
                    return;
                }

                if (trabajosReordenados.length > 0) {
                    const trabajosParaActualizar = trabajosReordenados.map(ta => ({
                        servicioId: this.servicioId,
                        trabajoId: ta.trabajoId,
                        ordenEjecucionTrabajo: ta.ordenEjecucionTrabajo,
                        secuencia: ta.ordenEjecucionTrabajo,
                        servicio: {
                            id: this.servicioId
                        },
                        trabajo: {
                            id: ta.trabajoId
                        }
                    }));
                    try {
                        await this.servicioTrabajoService.actualizarLote(trabajosParaActualizar).toPromise();
                        console.log('onSubmit - Orden de trabajos actualizado exitosamente');
                    } catch (error) {
                        console.error('onSubmit - Error al actualizar el orden de los trabajos:', error);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                        return;
                    }
                }

                if (trabajosNuevos.length > 0) {
                    console.log('onSubmit - Continuando con la adición de nuevos trabajos');
                } else {
                    this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    this.dialogRef.close(true);
                    return;
                }
            }

            if (this.trabajosAsignados.length === 0) {
                console.log('onSubmit - No hay trabajos para asignar');
                this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                this.dialogRef.close(true);
                return;
            }

            const trabajosFormateados = this.trabajosAsignados.map(trabajo => ({
                servicioId: this.servicioId,
                trabajoId: trabajo.trabajoId,
                ordenEjecucionTrabajo: trabajo.ordenEjecucionTrabajo,
                secuencia: trabajo.ordenEjecucionTrabajo,
                servicio: {
                    id: this.servicioId
                },
                trabajo: {
                    id: trabajo.trabajoId
                }
            }));

            console.log('onSubmit - Datos formateados para enviar:', trabajosFormateados);

            const trabajosNuevosParaEnviar = trabajosFormateados.filter(trabajoFormateado =>
                !this.data.servicioTrabajos.some((st: any) => st.trabajo.id === trabajoFormateado.trabajoId)
            );

            console.log('onSubmit - Trabajos nuevos a enviar:', trabajosNuevosParaEnviar);

            if (trabajosNuevosParaEnviar.length === 0) {
                console.log('onSubmit - No hay trabajos nuevos para enviar');
                this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                this.dialogRef.close(true);
                return;
            }

            this.servicioTrabajoService.crearLote(trabajosNuevosParaEnviar).subscribe({
                next: (response) => {
                    console.log('onSubmit - Respuesta exitosa:', response);
                    if (this.esActualizar()) {
                        this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    } else {
                        this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
                    }
                    this.dialogRef.close(true);
                },
                error: (error) => {
                    console.error('onSubmit - Error en la petición:', error);
                    const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                    this.toastr.error(errorMessage);
                }
            });
        } catch (error) {
            console.error('onSubmit - Error inesperado:', error);
            this.toastr.error(this.translate.instant('alertas.toastr.error.inesperado'));
        } finally {
            this.isLoading = false;
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
} 