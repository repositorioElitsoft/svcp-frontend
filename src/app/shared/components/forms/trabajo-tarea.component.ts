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
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { Zona } from '../../../core/models/zona.model';
import { Tarea } from '../../../core/models/tarea.model';
import { ApiEntityResponse } from '../../../core/models/api-entity-response.model';

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
        TituloDialogoComponent
    ],
    templateUrl: './trabajo-tarea.component.html'
})
export class TrabajoTareaFormComponent implements OnInit {
    // Formulario
    form: FormGroup;

    // Datos del trabajo
    trabajoId: number = 0;
    trabajoDescripcion: string = '';

    esActualizar(): boolean {
        return false; // Este formulario solo se usa para crear, no para actualizar
    }

    // Listas
    Tareas: any[] = [];
    tareasAsignadas: any[] = [];

    // Control de estado
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TrabajoTareaFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private trabajoTareaService: TrabajoTareaService,
        private tareaService: TareaService,
        private toastr: ToastrService
    ) {
        if (data && data.id) {
            this.trabajoId = data.id;
            this.trabajoDescripcion = data.descripcionTrabajo;
        } else {
            console.error('No se recibió un objeto válido en data');
        }

        this.form = this.fb.group({
            tareas: [[], Validators.required]
        });
    }

    ngOnInit() {
        if (this.trabajoId) {
            this.cargarDatos();
        }
    }

    cargarDatos() {
        console.log("Datos recibidos en el formulario:", this.data);

        // Verificar si 'data.object' existe y tiene el campo 'descripcionSector'
        if (this.esActualizar() && this.data?.object) {
            console.log("Objeto recibido:", this.data.object);

            this.form.patchValue({
                /*object-fields-edit*/
                id: this.data.object.id,
                descripcionSector: this.data.object.descripcionTrabajo,
                trabajoTareas: this.data.object.trabajoTareas
            });

            console.log("Datos en el formulario después de patchValue:", this.form.value);
        } else {
            console.error("No se recibió un objeto válido en 'data'");
        }
        /*services-init-call*/

        this.tareaService.buscarTodos().subscribe({
            next: (response: ApiEntityResponse<Tarea[]>) => {
                this.Tareas = response.data;
                if (this.data?.object?.tarea?.id) {
                    const foundTarea = this.Tareas.find((tarea: Tarea) => tarea.id === this.data.object.tarea.id);
                    if (foundTarea) {
                        this.form.patchValue({ tareas: [foundTarea] });
                    }
                }
            }
        });
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
        if (!event || !event.value) return;

        const tareaId = event.value;
        const tareaSeleccionada = this.Tareas.find(t => t.id === tareaId);

        if (tareaSeleccionada) {
            const nuevaTarea = {
                tareaId: tareaSeleccionada.id,
                descripcion: tareaSeleccionada.descripcion
            };

            // Verificar si la tarea ya está asignada
            if (!this.tareasAsignadas.some(t => t.tareaId === tareaId)) {
                this.tareasAsignadas.push(nuevaTarea);
                this.form.patchValue({ tareas: this.tareasAsignadas });
            }
        }
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