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

// Componentes y Modelos
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { ChipsFormComponent, ChipItem } from '../chips-form/chips-form.component';
import { Trabajo } from '../../../core/models/trabajo.model';
import { ApiEntityResponse } from '../../../core/models/api-entity-response.model';
import { ServicioTrabajo } from '../../../core/models/servicio-trabajo.model';

/**
 * Interface para manejar los trabajos asignados en el componente
 */
interface TrabajoAsignado extends ChipItem {
    trabajoId: number;
    descripcion: string;
    descripcionTrabajo: string;
    ordenEjecucionTrabajo: number;
    displayText: string;
}

interface PaginatedResponse {
    content: ServicioTrabajo[];
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    empty: boolean;
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
        DragDropModule,
        ChipsFormComponent
    ],
    templateUrl: './servicio-trabajo.component.html'
})
export class ServicioTrabajoFormComponent implements OnInit, OnDestroy {
    // #region Propiedades

    // Formulario
    form!: FormGroup;

    // Datos del servicio
    servicioId: number = 0;
    servicioDescripcion: string = '';
    data: any;

    // Listas de trabajos
    Trabajos: Trabajo[] = [];
    trabajosAsignados: TrabajoAsignado[] = [];
    trabajosDisponibles: Trabajo[] = [];

    // Control de estado
    isLoading = false;
    ultimoValor: number = 0;
    mostrarTodos: boolean = false;

    // Control de suscripciones
    private destroy$ = new Subject<void>();

    // #endregion

    // #region Constructor y Ciclo de Vida

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

        this.cargarTrabajos();

        if (this.Trabajos.length > 0) {
            this.actualizarTrabajosDisponibles();
        }

        if (this.data?.mostrarTodo) {
            this.mostrarTodos = true;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // #endregion

    // #region Inicialización y Carga de Datos

    /**
     * Inicializa el formulario con las validaciones necesarias
     */
    private inicializarFormulario(): void {
        this.form = this.fb.group({
            trabajos: [[], Validators.required]
        });
        console.log('inicializarFormulario - Formulario creado:', this.form.value);
    }

    /**
     * Inicializa los datos del servicio a partir de la data recibida
     */
    private inicializarDatosServicio(): void {
        console.log('1. inicializarDatosServicio - this.data inicial:', this.data);

        if (this.data?.id) {
            this.servicioId = this.data.id;
            this.servicioDescripcion = this.data.descripcion || '';
            console.log('2. servicioId asignado:', this.servicioId);
            console.log('2.1 servicioDescripcion asignada:', this.servicioDescripcion);

            // Cargar datos del servicio y sus trabajos
            this.isLoading = true;
            this.servicioTrabajoService.buscarFiltrado({
                servicio: this.servicioId,
                pageNumber: 0,
                sortField: 'servicio',
                sortDirection: 'ASC'
            }).subscribe({
                next: (response: ApiEntityResponse<ServicioTrabajo[]>) => {
                    console.log('3. Respuesta completa del servicio:', response);

                    // Cast de la respuesta al tipo paginado
                    const paginatedResponse = response as unknown as PaginatedResponse;

                    // La respuesta ya viene con la estructura de paginación
                    if (paginatedResponse?.content && paginatedResponse.content.length > 0) {
                        console.log('4. Content de la respuesta:', paginatedResponse.content);
                        console.log('5. Primer elemento de content:', paginatedResponse.content[0]);

                        // Guardar la data completa para uso posterior
                        this.data = {
                            id: this.servicioId,
                            descripcion: paginatedResponse.content[0].servicio?.descripcion || '',
                            servicioTrabajos: paginatedResponse.content
                        };
                        console.log('6. this.data después de asignar:', this.data);

                        // Establecer la descripción del servicio
                        this.servicioDescripcion = paginatedResponse.content[0].servicio?.descripcion || '';
                        console.log('7. this.servicioDescripcion:', this.servicioDescripcion);

                        // Mapear los trabajos
                        this.trabajosAsignados = paginatedResponse.content.map((item: ServicioTrabajo) => ({
                            id: item.trabajo?.id || 0,
                            trabajoId: item.trabajo?.id || 0,
                            descripcion: item.trabajo?.descripcionTrabajo || '',
                            descripcionTrabajo: item.trabajo?.descripcionTrabajo || '',
                            ordenEjecucionTrabajo: item.secuencia,
                            displayText: item.trabajo?.descripcionTrabajo || ''
                        }));

                        this.trabajosAsignados.sort((a, b) => a.ordenEjecucionTrabajo - b.ordenEjecucionTrabajo);
                        console.log('9. trabajosAsignados después de ordenar:', this.trabajosAsignados);

                        this.ultimoValor = Math.max(...this.trabajosAsignados.map(item => item.ordenEjecucionTrabajo));
                        console.log('10. ultimoValor:', this.ultimoValor);

                        this.form.patchValue({
                            trabajos: this.trabajosAsignados
                        });
                        console.log('11. Formulario después de patchValue:', this.form.value);
                    } else {
                        console.log('No hay contenido en la respuesta o está vacío');
                    }
                },
                error: (error: unknown) => {
                    console.error('Error al cargar datos del servicio:', error);
                    this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                },
                complete: () => {
                    this.isLoading = false;
                    this.cargarTrabajos();
                }
            });
        } else {
            console.warn('inicializarDatosServicio - No se recibió un ID de servicio válido');
        }
    }

    /**
     * Carga la lista de trabajos disponibles
     */
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

    /**
     * Actualiza la lista de trabajos disponibles filtrando los ya asignados
     */
    private actualizarTrabajosDisponibles(): void {
        console.log('actualizarTrabajosDisponibles - Iniciando actualización');

        this.trabajosDisponibles = this.Trabajos.filter(trabajo =>
            !this.trabajosAsignados.some(ta => ta.trabajoId === trabajo.id)
        );

        console.log('actualizarTrabajosDisponibles - Trabajos disponibles:', this.trabajosDisponibles);
    }

    // #endregion

    // #region Manejo de Trabajos

    /**
     * Elimina un trabajo de la lista de asignados
     */
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

    /**
     * Limpia todos los trabajos asignados
     */
    onTrabajosClear(): void {
        console.log('onTrabajosClear - Limpiando todos los trabajos');

        this.trabajosAsignados = [];
        this.form.patchValue({ trabajos: [] });
        this.actualizarTrabajosDisponibles();
        this.trabajosAsignados = [...this.trabajosAsignados];
    }

    /**
     * Maneja la selección de un nuevo trabajo
     */
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
                ordenEjecucionTrabajo: this.ultimoValor + 1,
                displayText: trabajoSeleccionado.descripcionTrabajo
            };

            this.trabajosAsignados = [...this.trabajosAsignados, nuevoTrabajoAsignado];
            this.ultimoValor++;

            console.log('onTrabajoSelect - Lista actualizada de trabajos:', this.trabajosAsignados);

            this.form.patchValue({ trabajos: this.trabajosAsignados });
            this.actualizarTrabajosDisponibles();
            this.trabajosAsignados = [...this.trabajosAsignados];
        }
    }

    /**
     * Maneja el reordenamiento de trabajos por drag and drop
     */
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

    onTrabajosReordered(trabajos: TrabajoAsignado[]): void {
        this.trabajosAsignados = trabajos;
        this.form.patchValue({ trabajos: this.trabajosAsignados });
    }

    // #endregion

    // #region Guardado y Validación

    /**
     * Verifica si es una operación de actualización
     */
    esActualizar(): boolean {
        const servicioTrabajos = this.data?.servicioTrabajos;
        return Array.isArray(servicioTrabajos) && servicioTrabajos.length > 0;
    }

    /**
     * Maneja el envío del formulario
     */
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
            // Manejo de actualización
            if (this.esActualizar() && Array.isArray(this.data.servicioTrabajos)) {
                await this.manejarActualizacion();
                return;
            }

            // Manejo de creación
            await this.manejarCreacion();

        } catch (error) {
            console.error('onSubmit - Error inesperado:', error);
            this.toastr.error(this.translate.instant('alertas.toastr.error.inesperado'));
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Maneja la lógica de actualización de trabajos
     */
    private async manejarActualizacion(): Promise<void> {
        if (this.trabajosAsignados.length === 0) {
            await this.eliminarTodosLosTrabajos();
            return;
        }

        // Eliminar trabajos que ya no están en la lista
        const trabajosEliminados = this.data.servicioTrabajos.filter(
            (st: any) => !this.trabajosAsignados.some(ta => ta.trabajoId === st.trabajo.id)
        );

        if (trabajosEliminados.length > 0) {
            await this.eliminarTrabajos(trabajosEliminados);
        }

        // Actualizar orden de trabajos existentes
        const trabajosReordenados = this.trabajosAsignados.filter(ta => {
            const trabajoExistente = this.data.servicioTrabajos.find((st: any) => st.trabajo.id === ta.trabajoId);
            return trabajoExistente && trabajoExistente.ordenEjecucionTrabajo !== ta.ordenEjecucionTrabajo;
        });

        if (trabajosReordenados.length > 0) {
            await this.actualizarOrdenTrabajos(trabajosReordenados);
        }

        // Agregar nuevos trabajos
        const trabajosNuevos = this.trabajosAsignados.filter(
            ta => !this.data.servicioTrabajos.some((st: any) => st.trabajo.id === ta.trabajoId)
        );

        if (trabajosNuevos.length > 0) {
            await this.agregarNuevosTrabajos(trabajosNuevos);
        }

        this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
        this.dialogRef.close(true);
    }

    /**
     * Maneja la lógica de creación de nuevos trabajos
     */
    private async manejarCreacion(): Promise<void> {
        if (this.trabajosAsignados.length === 0) {
            this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
            this.dialogRef.close(true);
            return;
        }

        const trabajosFormateados = this.trabajosAsignados.map(trabajo => ({
            servicio: {
                id: this.servicioId,
                descripcion: "string",
                estado: { id: 1, descripcion: "Activo" },
                tipoServicio: { id: 1, descripcion: "string", descripcionTipoServicio: "string" }
            },
            trabajo: {
                id: trabajo.trabajoId,
                descripcionTrabajo: "string"
            },
            secuencia: trabajo.ordenEjecucionTrabajo
        }));

        console.log('onSubmit - Datos formateados para enviar:', trabajosFormateados);

        // Si no hay servicioTrabajos previos, enviamos todos los trabajos
        if (!this.data?.servicioTrabajos) {
            this.servicioTrabajoService.crearLote(trabajosFormateados).subscribe({
                next: (response) => {
                    console.log('onSubmit - Respuesta exitosa:', response);
                    this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                    this.dialogRef.close(true);
                },
                error: (error) => {
                    console.error('onSubmit - Error en la petición:', error);
                    const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                    this.toastr.error(errorMessage);
                }
            });
            return;
        }

        // Si hay servicioTrabajos previos, filtramos los nuevos
        const trabajosNuevosParaEnviar = trabajosFormateados.filter(trabajoFormateado =>
            !this.data.servicioTrabajos.some((st: any) => st.trabajo.id === trabajoFormateado.trabajo.id)
        );

        if (trabajosNuevosParaEnviar.length === 0) {
            this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
            this.dialogRef.close(true);
            return;
        }

        this.servicioTrabajoService.crearLote(trabajosNuevosParaEnviar).subscribe({
            next: (response) => {
                console.log('onSubmit - Respuesta exitosa:', response);
                this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                this.dialogRef.close(true);
            },
            error: (error) => {
                console.error('onSubmit - Error en la petición:', error);
                const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error));
                this.toastr.error(errorMessage);
            }
        });
    }

    /**
     * Elimina todos los trabajos asociados
     */
    private async eliminarTodosLosTrabajos(): Promise<void> {
        const trabajosParaEliminar = this.data.servicioTrabajos.map((st: any) => ({
            servicio: {
                id: this.servicioId,
                descripcion: "string",
                estado: { id: 1, descripcion: "Activo" },
                tipoServicio: { id: 1, descripcion: "string", descripcionTipoServicio: "string" }
            },
            trabajo: {
                id: st.trabajo.id,
                descripcionTrabajo: "string"
            },
            secuencia: st.ordenEjecucionTrabajo
        }));

        try {
            await this.servicioTrabajoService.borrarLote(trabajosParaEliminar).toPromise();
            this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
            this.dialogRef.close(true);
        } catch (error) {
            console.error('eliminarTodosLosTrabajos - Error:', error);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
        }
    }

    /**
     * Elimina trabajos específicos
     */
    private async eliminarTrabajos(trabajosEliminados: any[]): Promise<void> {
        const trabajosParaEliminar = trabajosEliminados.map((st: any) => ({
            servicio: {
                id: this.servicioId,
                descripcion: "string",
                estado: { id: 1, descripcion: "Activo" },
                tipoServicio: { id: 1, descripcion: "string", descripcionTipoServicio: "string" }
            },
            trabajo: {
                id: st.trabajo.id,
                descripcionTrabajo: "string"
            },
            secuencia: st.ordenEjecucionTrabajo
        }));

        try {
            await this.servicioTrabajoService.borrarLote(trabajosParaEliminar).toPromise();
        } catch (error) {
            console.error('eliminarTrabajos - Error:', error);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
            throw error;
        }
    }

    /**
     * Actualiza el orden de los trabajos
     */
    private async actualizarOrdenTrabajos(trabajosReordenados: TrabajoAsignado[]): Promise<void> {
        const trabajosParaActualizar = trabajosReordenados.map(ta => ({
            servicio: {
                id: this.servicioId,
                descripcion: "string",
                estado: { id: 1, descripcion: "Activo" },
                tipoServicio: { id: 1, descripcion: "string", descripcionTipoServicio: "string" }
            },
            trabajo: {
                id: ta.trabajoId,
                descripcionTrabajo: "string"
            },
            secuencia: ta.ordenEjecucionTrabajo
        }));

        try {
            await this.servicioTrabajoService.actualizarLote(trabajosParaActualizar).toPromise();
        } catch (error) {
            console.error('actualizarOrdenTrabajos - Error:', error);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
            throw error;
        }
    }

    /**
     * Agrega nuevos trabajos al servicio
     */
    private async agregarNuevosTrabajos(trabajosNuevos: TrabajoAsignado[]): Promise<void> {
        const trabajosFormateados = trabajosNuevos.map(trabajo => ({
            servicio: {
                id: this.servicioId,
                descripcion: "string",
                estado: { id: 1, descripcion: "Activo" },
                tipoServicio: { id: 1, descripcion: "string", descripcionTipoServicio: "string" }
            },
            trabajo: {
                id: trabajo.trabajoId,
                descripcionTrabajo: "string"
            },
            secuencia: trabajo.ordenEjecucionTrabajo
        }));

        try {
            await this.servicioTrabajoService.crearLote(trabajosFormateados).toPromise();
        } catch (error) {
            console.error('agregarNuevosTrabajos - Error:', error);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
            throw error;
        }
    }

    // #endregion

    // #region Utilidades

    /**
     * Cierra el diálogo sin guardar cambios
     */
    onCancel(): void {
        this.dialogRef.close();
    }

    mapTrabajoToChipItem(trabajo: TrabajoAsignado): TrabajoAsignado {
        return {
            ...trabajo,
            displayText: trabajo.descripcionTrabajo
        };
    }

    onChipDeleted(item: ChipItem): void {
        const trabajo = this.trabajosAsignados.find(t => t.id === item.id);
        if (trabajo) {
            this.onTrabajoDelete(trabajo);
        }
    }

    onChipsReordered(items: ChipItem[]): void {
        this.trabajosAsignados = items.map((item, index) => ({
            ...this.trabajosAsignados.find(t => t.id === item.id)!,
            ordenEjecucionTrabajo: index + 1
        }));

        this.form.patchValue({ trabajos: this.trabajosAsignados });
        console.log('Trabajos reordenados:', this.trabajosAsignados);
    }

    // #endregion
} 