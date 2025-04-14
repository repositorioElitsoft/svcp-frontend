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
import { TrabajoTareaService } from '../../../core/services/trabajo-tarea.service';
import { TareaService } from '../../../core/services/tarea.service';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';

// Componentes
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { Tarea } from '../../../core/models/tarea.model';
import { ApiEntityResponse } from '../../../core/models/api-entity-response.model';
import { TrabajoTarea } from '../../../core/models/trabajo-tarea.model';

interface TareaAsignada {
    id: number;
    tareaId: number;
    descripcion: string;
    descripcionTarea: string;
    ordenEjecucionTarea: number;
}

@Component({
    selector: 'app-trabajo-tarea-form',
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
    templateUrl: './trabajo-tarea.component.html'
})
export class TrabajoTareaFormComponent implements OnInit, OnDestroy {
    // Formulario
    form!: FormGroup;

    // Datos del trabajo
    trabajoId: number = 0;
    trabajoDescripcion: string = '';
    data: any;

    // Listas
    Tareas: Tarea[] = [];
    tareasAsignadas: TareaAsignada[] = [];
    tareasDisponibles: Tarea[] = [];

    // Control de estado
    isLoading = false;
    ultimoValor: number = 0;
    mostrarTodas: boolean = false;

    // Control de suscripciones
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TrabajoTareaFormComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private trabajoTareaService: TrabajoTareaService,
        private tareaService: TareaService,
        private toastr: ToastrService,
        private translate: TranslateService
    ) {
        console.log('Constructor - Data recibida:', data);
        this.data = data;
        this.inicializarFormulario();
        this.inicializarDatosTrabajo();
    }

    ngOnInit(): void {
        console.log('ngOnInit - Estado inicial:', {
            trabajoId: this.trabajoId,
            trabajoDescripcion: this.trabajoDescripcion,
            tareasAsignadas: this.tareasAsignadas
        });

        if (this.trabajoId) {
            this.cargarTareas();
        }

        // Inicializar tareasDisponibles con todas las tareas si ya están cargadas
        if (this.Tareas.length > 0) {
            this.actualizarTareasDisponibles();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Inicializa el formulario con sus validaciones
     */
    private inicializarFormulario(): void {
        this.form = this.fb.group({
            tareas: [[], Validators.required]
        });
        console.log('inicializarFormulario - Formulario creado:', this.form.value);
    }

    /**
     * Inicializa los datos del trabajo desde la información recibida
     */
    private inicializarDatosTrabajo(): void {
        console.log('inicializarDatosTrabajo - Iniciando con data:', this.data);

        if (this.data?.id) {
            this.trabajoId = this.data.id;
            this.trabajoDescripcion = this.data.descripcionTrabajo || '';

            if (Array.isArray(this.data.trabajoTareas) && this.data.trabajoTareas.length > 0) {
                console.log('inicializarDatosTrabajo - TrabajoTareas recibidas:', this.data.trabajoTareas);

                this.tareasAsignadas = this.data.trabajoTareas.map((item: { tarea: { id: number, descripcionTarea: string }, ordenEjecucionTarea: number }) => ({
                    id: item.tarea.id,
                    tareaId: item.tarea.id,
                    descripcion: item.tarea.descripcionTarea,
                    descripcionTarea: item.tarea.descripcionTarea,
                    ordenEjecucionTarea: item.ordenEjecucionTarea
                }));

                // Ordenar las tareas por ordenEjecucionTarea
                this.tareasAsignadas.sort((a, b) => a.ordenEjecucionTarea - b.ordenEjecucionTarea);

                this.ultimoValor = Math.max(...this.data.trabajoTareas.map((item: any) => item.ordenEjecucionTarea || 0));
                console.log('inicializarDatosTrabajo - Tareas asignadas mapeadas:', this.tareasAsignadas);
                console.log('inicializarDatosTrabajo - Último valor de ordenEjecucionTarea:', this.ultimoValor);

                this.form.patchValue({
                    tareas: this.tareasAsignadas
                });
                console.log('inicializarDatosTrabajo - Formulario actualizado:', this.form.value);
            }
        } else {
            console.warn('inicializarDatosTrabajo - No se recibió un objeto válido en data');
        }
    }

    /**
     * Determina si el formulario está en modo actualización
     */
    esActualizar(): boolean {
        // Verificar si trabajoTareas existe y es un array con elementos
        const trabajoTareas = this.data?.trabajoTareas;
        return Array.isArray(trabajoTareas) && trabajoTareas.length > 0;
    }

    /**
     * Carga los datos necesarios para el formulario
     */
    private cargarTareas(): void {
        console.log('cargarTareas - Iniciando carga de tareas');

        this.tareaService.buscarTodos()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: ApiEntityResponse<Tarea[]>) => {
                    this.Tareas = response.data;
                    this.actualizarTareasDisponibles();
                    console.log('cargarTareas - Tareas cargadas:', this.Tareas);
                },
                error: (error) => {
                    console.error('cargarTareas - Error al cargar tareas:', error);
                }
            });
    }

    /**
     * Actualiza la lista de tareas disponibles para selección
     */
    private actualizarTareasDisponibles(): void {
        console.log('actualizarTareasDisponibles - Iniciando actualización');

        // Filtrar las tareas que ya están asignadas
        this.tareasDisponibles = this.Tareas.filter(tarea =>
            !this.tareasAsignadas.some(ta => ta.tareaId === tarea.id)
        );

        console.log('actualizarTareasDisponibles - Tareas disponibles:', this.tareasDisponibles);
    }

    /**
     * Maneja la eliminación de una tarea del conjunto seleccionado
     */
    onTareaDelete(tarea: TareaAsignada): void {
        console.log('onTareaDelete - Tarea a eliminar:', tarea);

        // Filtrar la tarea eliminada
        this.tareasAsignadas = this.tareasAsignadas.filter(t => t.tareaId !== tarea.tareaId);

        // Actualizar el ordenEjecucionTarea para cada tarea restante
        this.tareasAsignadas.forEach((t, index) => {
            t.ordenEjecucionTarea = index + 1;
        });

        console.log('onTareaDelete - Lista actualizada:', this.tareasAsignadas);

        // Actualizar el formulario con los nuevos valores
        this.form.patchValue({ tareas: this.tareasAsignadas });

        // Actualizar las tareas disponibles después de eliminar
        this.actualizarTareasDisponibles();

        // Forzar la detección de cambios
        this.tareasAsignadas = [...this.tareasAsignadas];
    }

    /**
     * Maneja la eliminación de todas las tareas seleccionadas
     */
    onTareasClear(): void {
        console.log('onTareasClear - Limpiando todas las tareas');

        // Limpiar todas las tareas
        this.tareasAsignadas = [];

        // Actualizar el formulario con los nuevos valores
        this.form.patchValue({ tareas: [] });

        // Actualizar las tareas disponibles después de limpiar
        this.actualizarTareasDisponibles();

        // Forzar la detección de cambios
        this.tareasAsignadas = [...this.tareasAsignadas];
    }

    /**
     * Maneja la selección de nuevas tareas
     */
    onTareaSelect(event: any): void {
        console.log('onTareaSelect - Evento recibido:', event);

        if (!event?.value) {
            console.log('onTareaSelect - No hay valor en el evento');
            return;
        }

        const tareaId = event.value;
        const tareaSeleccionada = this.Tareas.find(t => t.id === tareaId);
        console.log('onTareaSelect - Tarea seleccionada:', tareaSeleccionada);

        if (tareaSeleccionada) {
            // Verificar si la tarea ya está en las tareas asignadas localmente
            const tareaYaAsignada = this.tareasAsignadas.some(t => t.tareaId === tareaSeleccionada.id);

            if (tareaYaAsignada) {
                console.log('onTareaSelect - Tarea ya asignada, ignorando');
                this.toastr.warning(this.translate.instant('alertas.toastr.errors.trabajoTarea.DUPLICADO'));
                return;
            }

            // Agregar la nueva tarea
            console.log('onTareaSelect - Agregando nueva tarea');

            const nuevaTareaAsignada: TareaAsignada = {
                id: tareaSeleccionada.id,
                tareaId: tareaSeleccionada.id,
                descripcion: tareaSeleccionada.descripcionTarea,
                descripcionTarea: tareaSeleccionada.descripcionTarea,
                ordenEjecucionTarea: this.ultimoValor + 1
            };

            // Agregar la nueva tarea al array
            this.tareasAsignadas = [...this.tareasAsignadas, nuevaTareaAsignada];
            this.ultimoValor++;

            console.log('onTareaSelect - Lista actualizada de tareas:', this.tareasAsignadas);

            // Actualizar el formulario con los nuevos valores
            this.form.patchValue({ tareas: this.tareasAsignadas });
            console.log('onTareaSelect - Formulario actualizado:', this.form.value);

            // Actualizar las tareas disponibles después de agregar
            this.actualizarTareasDisponibles();

            // Forzar la detección de cambios
            this.tareasAsignadas = [...this.tareasAsignadas];
        }
    }

    /**
     * Maneja el evento de drag and drop para reordenar las tareas
     */
    onDrop(event: CdkDragDrop<TareaAsignada[]>): void {
        console.log('onDrop - Evento recibido:', event);

        if (event.previousIndex === event.currentIndex) {
            console.log('onDrop - No hay cambio en el orden');
            return;
        }

        // Mover el elemento en el array
        moveItemInArray(this.tareasAsignadas, event.previousIndex, event.currentIndex);

        // Actualizar el ordenEjecucionTarea para cada tarea
        this.tareasAsignadas.forEach((tarea, index) => {
            tarea.ordenEjecucionTarea = index + 1;
        });

        console.log('onDrop - Tareas reordenadas:', this.tareasAsignadas);

        // Actualizar el formulario con los nuevos valores
        this.form.patchValue({ tareas: this.tareasAsignadas });

        // Forzar la detección de cambios
        this.tareasAsignadas = [...this.tareasAsignadas];
    }

    /**
     * Guarda los cambios del formulario
     */
    async onSubmit(): Promise<void> {
        console.log('onSubmit - Iniciando envío del formulario');
        console.log('onSubmit - Estado del formulario:', {
            valid: this.form.valid,
            value: this.form.value,
            tareasAsignadas: this.tareasAsignadas
        });

        if (this.form.invalid) {
            console.warn('onSubmit - Formulario inválido');
            this.toastr.warning(this.translate.instant('alertas.toastr.camposRequeridos'));
            return;
        }

        this.isLoading = true;
        console.log('onSubmit - Preparando datos para enviar');

        try {
            // Si estamos en modo actualización
            if (this.esActualizar() && Array.isArray(this.data.trabajoTareas)) {
                // Si no hay tareas asignadas, eliminamos todas las existentes
                if (this.tareasAsignadas.length === 0) {
                    console.log('onSubmit - No hay tareas asignadas, eliminando todas las existentes');
                    const tareasParaEliminar = this.data.trabajoTareas.map((tt: any) => ({
                        trabajo: {
                            id: this.trabajoId
                        },
                        tarea: {
                            id: tt.tarea.id
                        },
                        ordenEjecucionTarea: tt.ordenEjecucionTarea
                    }));
                    console.log('onSubmit - Tareas formateadas para eliminar:', tareasParaEliminar);

                    try {
                        await this.trabajoTareaService.borrarTodo(tareasParaEliminar).toPromise();
                        console.log('onSubmit - Todas las tareas eliminadas exitosamente');
                        this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                        this.dialogRef.close(true);
                        return;
                    } catch (error) {
                        console.error('onSubmit - Error al eliminar tareas:', error);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                        return;
                    }
                }

                // Si hay tareas asignadas, eliminamos solo las que ya no están
                const tareasEliminadas = this.data.trabajoTareas.filter(
                    (tt: any) => !this.tareasAsignadas.some(ta => ta.tareaId === tt.tarea.id)
                );

                console.log('onSubmit - Tareas a eliminar:', tareasEliminadas);

                if (tareasEliminadas.length > 0) {
                    // Crear array de objetos con el formato correcto para eliminar en lote
                    const tareasParaEliminar = tareasEliminadas.map((tt: any) => ({
                        trabajo: {
                            id: this.trabajoId
                        },
                        tarea: {
                            id: tt.tarea.id
                        },
                        ordenEjecucionTarea: tt.ordenEjecucionTarea
                    }));
                    console.log('onSubmit - Tareas formateadas para eliminar:', tareasParaEliminar);

                    try {
                        await this.trabajoTareaService.borrarTodo(tareasParaEliminar).toPromise();
                        console.log('onSubmit - Tareas eliminadas exitosamente');
                    } catch (error) {
                        console.error('onSubmit - Error al eliminar tareas:', error);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                        return;
                    }
                }

                // Verificar si hay nuevas tareas para agregar o si hay cambios en el orden
                const tareasNuevas = this.tareasAsignadas.filter(
                    ta => !this.data.trabajoTareas.some((tt: any) => tt.tarea.id === ta.tareaId)
                );

                const tareasReordenadas = this.tareasAsignadas.filter(ta => {
                    const tareaExistente = this.data.trabajoTareas.find((tt: any) => tt.tarea.id === ta.tareaId);
                    return tareaExistente && tareaExistente.ordenEjecucionTarea !== ta.ordenEjecucionTarea;
                });

                console.log('onSubmit - Tareas nuevas a agregar:', tareasNuevas);
                console.log('onSubmit - Tareas reordenadas:', tareasReordenadas);

                if (tareasNuevas.length === 0 && tareasReordenadas.length === 0) {
                    // Si no hay nuevas tareas para agregar ni cambios en el orden, cerramos el diálogo
                    this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    this.dialogRef.close(true);
                    return;
                }

                // Si hay tareas reordenadas, actualizamos el orden
                if (tareasReordenadas.length > 0) {
                    const tareasParaActualizar = tareasReordenadas.map(ta => ({
                        trabajoId: this.trabajoId,
                        tareaId: ta.tareaId,
                        ordenEjecucionTarea: ta.ordenEjecucionTarea,
                        trabajo: {
                            id: this.trabajoId
                        },
                        tarea: {
                            id: ta.tareaId
                        }
                    }));
                    try {
                        await this.trabajoTareaService.actualizarLote(tareasParaActualizar).toPromise();
                        console.log('onSubmit - Orden de tareas actualizado exitosamente');
                    } catch (error) {
                        console.error('onSubmit - Error al actualizar el orden de las tareas:', error);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                        return;
                    }
                }

                // Si hay nuevas tareas, continuamos con el proceso de agregar
                if (tareasNuevas.length > 0) {
                    console.log('onSubmit - Continuando con la adición de nuevas tareas');
                } else {
                    // Si solo se reordenaron las tareas, cerramos el diálogo
                    this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    this.dialogRef.close(true);
                    return;
                }
            }

            // Si no hay tareas asignadas después de eliminar, cerramos el diálogo
            if (this.tareasAsignadas.length === 0) {
                console.log('onSubmit - No hay tareas para asignar');
                this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                this.dialogRef.close(true);
                return;
            }

            // Formatear todas las tareas asignadas para enviar
            const tareasFormateadas = this.tareasAsignadas.map(tarea => ({
                trabajoId: this.trabajoId,
                tareaId: tarea.tareaId,
                ordenEjecucionTarea: tarea.ordenEjecucionTarea,
                trabajo: {
                    id: this.trabajoId
                },
                tarea: {
                    id: tarea.tareaId
                }
            }));

            console.log('onSubmit - Datos formateados para enviar:', tareasFormateadas);

            this.trabajoTareaService.crearLote(tareasFormateadas).subscribe({
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

    /**
     * Cierra el diálogo sin guardar cambios
     */
    onCancel(): void {
        this.dialogRef.close();
    }
} 