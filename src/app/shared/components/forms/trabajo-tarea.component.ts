import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

// Servicios
import { TrabajoTareaService } from '../../../core/services/trabajo-tarea.service';
import { TareaService } from '../../../core/services/tarea.service';

// Componentes
import { ChipsComponent } from '../chips/chips.component';

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
        ChipsComponent
    ],
    templateUrl: './trabajo-tarea.component.html'
})
export class TrabajoTareaFormComponent implements OnInit {
    // Formulario
    form: FormGroup;

    // Datos del trabajo
    trabajoId: number;
    trabajoDescripcion: string;

    // Listas
    tareasDisponibles: any[] = [];
    tareasAsignadas: any[] = [];

    // Control de estado
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TrabajoTareaFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private trabajoTareaService: TrabajoTareaService,
        private tareaService: TareaService,
        private toastr: ToastrService
    ) {
        this.trabajoId = data.trabajoId;
        this.trabajoDescripcion = data.trabajoDescripcion;

        // Inicialización del formulario
        this.form = this.fb.group({
            tareas: [[], Validators.required]
        });
    }

    ngOnInit() {
        this.cargarDatos();
    }

    /**
     * Carga los datos necesarios para el formulario:
     * - Tareas asignadas al trabajo (usando trabajo-tarea.service)
     * - Tareas disponibles (usando tarea.service)
     */
    private async cargarDatos() {
        this.isLoading = true;

        try {
            // Cargar tareas disponibles
            const tareasResponse = await this.tareaService.buscarTodos().toPromise();
            this.tareasDisponibles = tareasResponse?.data || [];

            // Cargar tareas asignadas al trabajo
            const trabajoTareasResponse = await this.trabajoTareaService.buscarFiltrado({ trabajoId: this.trabajoId }).toPromise();
            if (trabajoTareasResponse?.data) {
                this.tareasAsignadas = trabajoTareasResponse.data.map((tt: any) => ({
                    tareaId: tt.tareaId,
                    descripcion: this.tareasDisponibles.find(t => t.id === tt.tareaId)?.descripcion || ''
                }));
                this.form.patchValue({ tareas: this.tareasAsignadas });
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.toastr.error('Error al cargar los datos necesarios');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Maneja la eliminación de una tarea del conjunto seleccionado
     */
    onTareaDelete(tarea: any) {
        this.tareasAsignadas = this.tareasAsignadas.filter(t => t.tareaId !== tarea.tareaId);
        this.form.patchValue({ tareas: this.tareasAsignadas });
    }

    /**
     * Maneja la eliminación de todas las tareas seleccionadas
     */
    onTareasClear() {
        this.tareasAsignadas = [];
        this.form.patchValue({ tareas: [] });
    }

    /**
     * Maneja la selección de nuevas tareas
     */
    onTareaSelect(event: any) {
        this.trabajoTareaService.obtenerTodos().subscribe({
            next: (response: any) => {
                this.tareasDisponibles = response.data;
                const tareaId = event.value;
                const tareaSeleccionada = this.tareasDisponibles.find(t => t.id === tareaId);

                if (tareaSeleccionada && !this.tareasAsignadas.some(t => t.tareaId === tareaId)) {
                    const nuevaTarea = {
                        tareaId: tareaId,
                        descripcion: tareaSeleccionada.descripcion
                    };

                    this.tareasAsignadas = [...this.tareasAsignadas, nuevaTarea];
                    this.form.patchValue({ tareas: this.tareasAsignadas });
                }
            },
            error: (error) => {
                console.error('Error al cargar tareas:', error);
                this.toastr.error('Error al cargar las tareas disponibles');
            }
        });
    }

    /**
     * Guarda los cambios del formulario
     */
    async onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.isLoading = true;
        const formValue = this.form.value;

        try {
            const trabajoTareas = formValue.tareas.map((tarea: any) => ({
                trabajoId: this.trabajoId,
                tareaId: tarea.tareaId
            }));

            await this.trabajoTareaService.crearLote(trabajoTareas).toPromise();
            this.toastr.success('Tareas asignadas correctamente');
            this.dialogRef.close(true);
        } catch (error: any) {
            console.error('Error al guardar:', error);
            this.toastr.error('Error al guardar las tareas');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Cierra el diálogo sin guardar cambios
     */
    onCancel() {
        this.dialogRef.close();
    }
} 