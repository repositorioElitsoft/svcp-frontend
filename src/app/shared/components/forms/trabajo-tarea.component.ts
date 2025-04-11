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
        this.data = data;
        this.inicializarFormulario();
        this.inicializarDatosTrabajo();
    }

    ngOnInit(): void {
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
    }

    /**
     * Inicializa los datos del trabajo desde la información recibida
     */
    private inicializarDatosTrabajo(): void {
        if (this.data?.id) {
            this.trabajoId = this.data.id;
            this.trabajoDescripcion = this.data.descripcionTrabajo || '';

            // Si hay tareas asignadas, cargarlas con su descripción
            if (Array.isArray(this.data.trabajoTareas) && this.data.trabajoTareas.length > 0) {
                this.tareasAsignadas = this.data.trabajoTareas.map((item: { tarea: { id: number, descripcionTarea: string } }) => ({
                    id: item.tarea.id,
                    tareaId: item.tarea.id,
                    descripcion: item.tarea.descripcionTarea,
                    descripcionTarea: item.tarea.descripcionTarea
                }));

                // Obtener el último valor de ordenEjecucionTarea
                this.ultimoValor = Math.max(...this.data.trabajoTareas.map((item: any) => item.ordenEjecucionTarea || 0));
                console.log('Último valor de ordenEjecucionTarea:', this.ultimoValor);
                console.log('TrabajoTareas:', this.data.trabajoTareas);

                this.form.patchValue({
                    tareas: this.tareasAsignadas
                });
            }
        } else {
            console.error('No se recibió un objeto válido en data');
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
        this.tareaService.buscarTodos()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: ApiEntityResponse<Tarea[]>) => {
                    this.Tareas = response.data;
                }
            });
    }

    /**
     * Maneja la eliminación de una tarea del conjunto seleccionado
     */
    onTareaDelete(tarea: TareaAsignada): void {
        this.tareasAsignadas = this.tareasAsignadas.filter(t => t.tareaId !== tarea.tareaId);
        this.form.patchValue({ tareas: this.tareasAsignadas });
    }

    /**
     * Maneja la eliminación de todas las tareas seleccionadas
     */
    onTareasClear(): void {
        this.tareasAsignadas = [];
        this.form.patchValue({ tareas: [] });
    }

    /**
     * Maneja la selección de nuevas tareas
     */
    onTareaSelect(event: any): void {
        if (!event?.value) return;
        const tareaId = event.value;
        const tareaSeleccionada = this.Tareas.find(t => t.id === tareaId);
        if (tareaSeleccionada) {
            this.form.patchValue({ tareas: tareaSeleccionada });
        }
    }

    /**
     * Guarda los cambios del formulario
     */
    async onSubmit(): Promise<void> {
        console.log('=== INICIO SUBMIT ===');

        if (this.form.invalid) {
            this.toastr.warning(this.translate.instant('alertas.toastr.camposRequeridos'));
            return;
        }

        const tareaSeleccionada = this.form.get('tareas')?.value;
        if (!tareaSeleccionada) {
            this.toastr.warning(this.translate.instant('alertas.toastr.seleccionarTarea'));
            return;
        }

        this.isLoading = true;

        try {
            // Crear el objeto con el formato que espera el backend
            const tareaFormateada = {
                trabajoId: this.trabajoId,
                tareaId: tareaSeleccionada.id,
                ordenEjecucionTarea: this.ultimoValor + 1,
                trabajo: {
                    id: this.trabajoId
                },
                tarea: {
                    id: tareaSeleccionada.id
                }
            };

            console.log('Tarea a enviar:', tareaFormateada);
            console.log('Último valor usado:', this.ultimoValor);

            this.trabajoTareaService.crearLote([tareaFormateada]).subscribe({
                next: (response) => {
                    if (this.esActualizar()) {
                        this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    } else {
                        this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
                    }
                    this.dialogRef.close(true);
                },
                error: (error) => {
                    const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                    this.toastr.error(errorMessage);
                }
            });
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