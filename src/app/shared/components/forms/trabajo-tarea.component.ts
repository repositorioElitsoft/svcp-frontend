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

// Servicios
import { TrabajoTareaService } from '../../../core/services/trabajo-tarea.service';
import { TareaService } from '../../../core/services/tarea.service';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';

// Componentes
import { ChipsComponent } from '../chips/chips.component';
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { Tarea } from '../../../core/models/tarea.model';
import { ApiEntityResponse } from '../../../core/models/api-entity-response.model';
import { TrabajoTarea } from '../../../core/models/trabajo-tarea.model';


interface TareaAsignada {
    id: number;
    tareaId: number;
    descripcion: string;
    descripcionTarea: string;
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
        ChipsComponent,
        TituloDialogoComponent,
        TranslateModule
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

    // Control de estado
    isLoading = false;
    ultimoValor: number = 0;

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

                this.tareasAsignadas = this.data.trabajoTareas.map((item: { tarea: { id: number, descripcionTarea: string } }) => ({
                    id: item.tarea.id,
                    tareaId: item.tarea.id,
                    descripcion: item.tarea.descripcionTarea,
                    descripcionTarea: item.tarea.descripcionTarea
                }));

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
                    console.log('cargarTareas - Tareas cargadas:', this.Tareas);
                },
                error: (error) => {
                    console.error('cargarTareas - Error al cargar tareas:', error);
                }
            });
    }

    /**
     * Maneja la eliminación de una tarea del conjunto seleccionado
     */
    onTareaDelete(tarea: TareaAsignada): void {
        console.log('onTareaDelete - Tarea a eliminar:', tarea);
        this.tareasAsignadas = this.tareasAsignadas.filter(t => t.tareaId !== tarea.tareaId);
        console.log('onTareaDelete - Lista actualizada:', this.tareasAsignadas);
        this.form.patchValue({ tareas: this.tareasAsignadas });
    }

    /**
     * Maneja la eliminación de todas las tareas seleccionadas
     */
    onTareasClear(): void {
        console.log('onTareasClear - Limpiando todas las tareas');
        this.tareasAsignadas = [];
        this.form.patchValue({ tareas: [] });
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

            // Verificar si la tarea ya existe en el trabajo (en la base de datos)
            const tareaExistente = this.data.trabajoTareas?.some(
                (tt: any) => tt.tarea.id === tareaSeleccionada.id
            );

            if (tareaYaAsignada || tareaExistente) {
                console.log('onTareaSelect - Tarea ya asignada o existente, ignorando');
                this.toastr.warning(this.translate.instant('alertas.toastr.tareaExistente'));
                return;
            }

            const nuevaTareaAsignada: TareaAsignada = {
                id: tareaSeleccionada.id,
                tareaId: tareaSeleccionada.id,
                descripcion: tareaSeleccionada.descripcionTarea,
                descripcionTarea: tareaSeleccionada.descripcionTarea
            };

            this.tareasAsignadas = [...this.tareasAsignadas, nuevaTareaAsignada];
            console.log('onTareaSelect - Nueva tarea asignada:', nuevaTareaAsignada);
            console.log('onTareaSelect - Lista actualizada de tareas:', this.tareasAsignadas);

            this.form.patchValue({ tareas: this.tareasAsignadas });
            console.log('onTareaSelect - Formulario actualizado:', this.form.value);
        }
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
                    const tareasParaEliminar = this.data.trabajoTareas.map((tt: { tarea: { id: number } }) => ({
                        trabajo: {
                            id: this.trabajoId
                        },
                        tarea: {
                            id: tt.tarea.id
                        }
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
                    const tareasParaEliminar = tareasEliminadas.map((tt: { tarea: { id: number } }) => ({
                        trabajo: {
                            id: this.trabajoId
                        },
                        tarea: {
                            id: tt.tarea.id
                        }
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

                // Verificar si hay nuevas tareas para agregar
                const tareasNuevas = this.tareasAsignadas.filter(
                    ta => !this.data.trabajoTareas.some((tt: any) => tt.tarea.id === ta.tareaId)
                );

                console.log('onSubmit - Tareas nuevas a agregar:', tareasNuevas);

                if (tareasNuevas.length === 0) {
                    // Si no hay nuevas tareas para agregar, cerramos el diálogo
                    this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    this.dialogRef.close(true);
                    return;
                }

                // Si hay nuevas tareas, continuamos con el proceso de agregar
                console.log('onSubmit - Continuando con la adición de nuevas tareas');
            }

            // Si no hay tareas asignadas después de eliminar, cerramos el diálogo
            if (this.tareasAsignadas.length === 0) {
                console.log('onSubmit - No hay tareas para asignar');
                this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                this.dialogRef.close(true);
                return;
            }

            // Obtener la última tarea agregada
            const ultimaTarea = this.tareasAsignadas[this.tareasAsignadas.length - 1];
            console.log('onSubmit - Última tarea seleccionada:', ultimaTarea);

            const tareaFormateada = {
                trabajoId: this.trabajoId,
                tareaId: ultimaTarea.tareaId,
                ordenEjecucionTarea: this.ultimoValor + 1,
                trabajo: {
                    id: this.trabajoId
                },
                tarea: {
                    id: ultimaTarea.tareaId
                }
            };

            console.log('onSubmit - Datos formateados para enviar:', tareaFormateada);

            this.trabajoTareaService.crearLote([tareaFormateada]).subscribe({
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