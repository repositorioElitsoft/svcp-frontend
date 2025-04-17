import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedTableV2Component } from "../../../shared/components/shared-table-v2/shared-table-v2.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { ServicioTrabajoService } from "../../../core/services/servicio-trabajo.service";
import { ServicioTrabajo } from "../../../core/models/servicio-trabajo.model";
import { TrabajoTareaService } from "../../../core/services/trabajo-tarea.service";
import { catchError, tap, throwError, forkJoin, map, of, switchMap } from "rxjs";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { BusquedaGenericaComponent } from "../../../shared/components/busqueda-generica/busqueda-generica.component";
import { ServicioService } from "../../../core/services/servicio.service";
import { Servicio, ServicioDTO } from "../../../core/models/servicio.model";
import { ServicioFormComponent } from "../../../shared/components/forms/servicio.component";
import { ServicioTrabajoFormComponent } from "../../../shared/components/forms/servicio-trabajo.component";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { BusquedaServicioComponent } from "./busqueda-servicio/busqueda-servicio.component";

@Component({
    selector: "app-servicio",
    standalone: true,
    imports: [
        CommonModule,
        SharedTableV2Component,
        MatIconModule,
        HeadTableComponent,
        MatPaginatorModule,
        OpcionesMantenedorComponent,
        TranslateModule,
        BusquedaGenericaComponent,
        FormsModule,
        MatSelectModule,
        BusquedaServicioComponent
    ],
    templateUrl: "./servicio.component.html",

})
export class ServicioComponent implements OnInit {
    displayedColumns: string[] = ['id', 'descripcion', 'tipoServicio', 'estado', 'trabajos'];
    isLoading = false;
    searchText: string = '';
    columnConfig: {
        field: string;
        type: 'text' | 'chips' | 'custom' | 'estado';
        nestedPath?: string;
        displayField?: string;
        customTemplate?: TemplateRef<any>;
        sortable?: boolean;
    }[] = [
            { field: 'id', type: 'text' },
            { field: 'descripcion', type: 'text' },
            {
                field: 'tipoServicio',
                type: 'text',
                nestedPath: 'descripcionTipoServicio',
                sortable: true
            },
            {
                field: 'estado',
                type: 'estado',
                sortable: true
            },
            {
                field: 'trabajos',
                type: 'chips',
                nestedPath: 'trabajo.descripcionTrabajo',
                sortable: false
            }
        ];
    dataSource: Servicio[] = [];
    titulo: string = 'Servicio';
    hasSelection = false;
    selectedData: any[] = [];
    pageNumber = 0;
    totalPages = 0;
    pageSize = 10;
    totalElements = 0;
    @ViewChild(SharedTableV2Component) sharedTableComponent!: SharedTableV2Component;
    activeOptionalFilters: any = [];
    currentSortState: { column: string, direction: string } | null = null;
    currentFilters: any = {};
    constructor(private cdr: ChangeDetectorRef,
        private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
        private translate: TranslateService, private toastr: ToastrService,
        private servicioTrabajoService: ServicioTrabajoService, private servicioService: ServicioService,
        private trabajoTareaService: TrabajoTareaService) { }

    ngOnInit() {
        this.obtenerDatos();
    }

    /********************************** TABLA - SHARED TABLE **********************************/
    onSelectionChange(selectedItems: any[]) {
        this.hasSelection = selectedItems.length > 0;
        this.selectedData = selectedItems;
    }

    onViewSelected(id: string): void {
        const selectedObject = this.dataSource.find(item => item.id === Number(id));
        if (!selectedObject) {
            return;
        }
        const dialogRef = this.dialog.open(ServicioFormComponent, {
            width: '400px',
            data: {
                esActualizar: true,
                object: {
                    ...selectedObject,
                    estado: selectedObject.estado || { id: 1, descripcion: 'Activo' }
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log("Ver seleccionado:", result);
            }
        });
    }

    onDeleteSelected(ids: string[]) {
        console.log("Eliminar seleccionados:", ids);
    }

    exportarExcel(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
        const handleExport = (dataArray: any[], translationBase: string) => {
            console.log("CAMINO: handleExport - Data recibida para procesar:", dataArray);

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                console.error("Error: No hay datos para exportar en handleExport.");
                return;
            }

            // Formatear los datos antes de la exportación
            const formattedData = dataArray.map(item => {
                const trabajosString = Array.isArray(item.trabajos)
                    ? item.trabajos
                        .map((t: any) => t.trabajo?.descripcionTrabajo || t.trabajo?.descripcion || '')
                        .filter((desc: string) => desc) // Filtrar valores vacíos
                        .join(', ')
                    : '';

                const formattedItem: any = {
                    id: item.id,
                    descripcion: item.descripcion,
                    tipoServicio: item.tipoServicio?.descripcionTipoServicio || '',
                    estado: item.estado?.descripcion || 'Activo',
                    trabajos: trabajosString
                };
                return formattedItem;
            });

            // Definir las columnas que queremos exportar y su orden
            const columnKeys = ['id', 'descripcion', 'tipoServicio', 'estado', 'trabajos'];

            const translationKeys = columnKeys.map(key => `${translationBase}.${key}`);

            this.translate.get(translationKeys).subscribe(translations => {
                const translatedData = formattedData.map(item => {
                    const newItem: any = {};
                    columnKeys.forEach((key, index) => {
                        const translatedKey = translations[translationKeys[index]] || key;
                        newItem[translatedKey] = item[key];
                    });
                    return newItem;
                });

                console.log("Data formateada para exportación:", translatedData);

                this.translate.get(`${translationBase}.titulo`).subscribe(title => {
                    this.exportService.exportToExcel(translatedData, title);
                });
            });
        };

        // Verificar si this.selectedData existe y tiene contenido
        console.log("VERIFICANDO SELECTED DATA:", this.selectedData);

        if (this.selectedData && Array.isArray(this.selectedData) && this.selectedData.length > 0) {
            console.log("CAMINO 1: Usando datos seleccionados - Cantidad:", this.selectedData.length);
            handleExport(this.selectedData, 'mantenedores.servicio');
            // Mostramos el mensaje específico para la exportación de datos seleccionados
            this.toastr.success(this.translate.instant('alertas.toastr.exportar.seleccionado.success'));
        } else {
            console.log("CAMINO 2: No hay datos seleccionados, realizando llamada a API");

            // Si no hay datos seleccionados o están vacíos, llamar a la API
            const filtros = {
                pageNumber: 0,
                pageSize: 2000,
                sortField: sortField,
                sortDirection: sortDirection,
                ...optionalFilter
            };

            console.log("Solicitando datos a la API con filtros:", filtros);

            this.servicioService.buscarFiltradoAsignacion(filtros).subscribe(
                (response: any) => {
                    const apiData = response?.content ?? response?.data ?? [];
                    console.log("CAMINO 2.1: Datos recibidos de API - Cantidad:", apiData.length);

                    if (apiData.length === 0) {
                        console.error("Error: La API no devolvió datos.");
                        this.toastr.error("No hay datos disponibles para exportar.");
                        return;
                    }

                    handleExport(apiData, 'mantenedores.servicio');
                    // Mostramos el mensaje específico para la exportación de datos de la API
                    this.toastr.success(this.translate.instant('alertas.toastr.exportar.todo.success'));
                },
                (error) => {
                    console.error("CAMINO 2.2: Error en la solicitud a la API:", error);
                    this.toastr.error("Ha ocurrido un error al obtener los datos para exportar.");
                }
            );
        }
    }

    volver() {
        this.router.navigate(['/portal/home']);
    }

    sortDatos(sortData: { selectedColumnName: string, currentSortType: string }) {
        // Mapear los nombres de las columnas a los campos del modelo
        const fieldMapping: { [key: string]: string } = {
            'id': 'id',
            'descripcion': 'descripcion',
            'tipoServicio': 'tipoServicio.descripcionTipoServicio',
            'estado': 'estado.descripcion',
            'fechaCreacion': 'fechaCreacion',
            'fechaModificacion': 'fechaModificacion',
            'usuarioCreacion': 'usuarioCreacion',
            'usuarioModificacion': 'usuarioModificacion'
        };

        // Obtener el campo de ordenamiento mapeado o usar el nombre de la columna original si no existe mapeo
        const sortField = fieldMapping[sortData.selectedColumnName] || sortData.selectedColumnName;

        // Validar la dirección de ordenamiento
        const sortDirection = ['asc', 'desc'].includes(sortData.currentSortType)
            ? sortData.currentSortType
            : 'asc';

        // Guardar el estado actual del ordenamiento
        this.currentSortState = {
            column: sortField,
            direction: sortDirection
        };

        console.log('Ordenando por:', sortField, 'en dirección:', sortDirection);

        // Llamar a obtenerDatos con los parámetros validados y los filtros actuales
        this.obtenerDatos(sortField, sortDirection, this.currentFilters);
    }

    onPageChanged(newPage: number) {
        console.log("Página cambiada", newPage);
        this.pageNumber = newPage;
        // Usar el estado del ordenamiento guardado si existe y los filtros actuales
        if (this.currentSortState) {
            this.obtenerDatos(this.currentSortState.column, this.currentSortState.direction, this.currentFilters);
        } else {
            this.obtenerDatos("id", "asc", this.currentFilters);
        }
    }

    buscar(data: { filter: any, labels: any[] }) {
        console.log('Search input:', data);
        this.pageNumber = 0;
        this.activeOptionalFilters = data.labels || [];
        this.currentFilters = data.filter;
        // Mantener el ordenamiento actual si existe
        if (this.currentSortState) {
            this.obtenerDatos(this.currentSortState.column, this.currentSortState.direction, data.filter);
        } else {
            this.obtenerDatos("id", "asc", data.filter);
        }
    }

    onFilterDeleted(filterData: { field: string, value: string }) {
        console.log('Eliminando filtro - Datos recibidos:', filterData);

        // Limpiar el filtro específico del currentFilters
        if (this.currentFilters && filterData.field) {
            delete this.currentFilters[filterData.field];
        }

        // Actualizar activeOptionalFilters
        this.activeOptionalFilters = this.activeOptionalFilters.filter(
            (filter: { field: string, value: string }) =>
                filter.field !== filterData.field
        );

        // Verificar si era el último filtro
        if (this.activeOptionalFilters.length === 0) {
            // Restablecer todos los filtros
            this.currentFilters = {};
            this.activeOptionalFilters = [];

            // Si no hay filtros, simplemente obtener todos los datos
            this.obtenerDatos();
            return;
        }

        // Si aún hay filtros, continuar con la lógica de filtrado
        const params = {
            pageSize: 5,
            pageNumber: 0,
            sortField: this.currentSortState?.column || 'id',
            sortDirection: (this.currentSortState?.direction || 'asc').toUpperCase(),
            ...this.transformFilters(this.currentFilters)
        };

        this.servicioService.buscarFiltradoAsignacion(params).subscribe({
            next: (response: any) => {
                this.procesarRespuestaFiltrado(response);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al aplicar filtros:', err);
                this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
            }
        });
    }

    private transformFilters(filters: any): any {
        const transformedFilters: any = {};

        // Mapeo de estados descriptivos a IDs
        const estadosMap: { [key: string]: number } = {
            'Activo': 1,
            'Cancelado': 2,
            'Inactivo': 3
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (key === 'estado' && typeof value === 'string') {
                // Transformar estado de texto a ID
                transformedFilters[key] = estadosMap[value] || value;
            } else {
                transformedFilters[key] = value;
            }
        });

        return transformedFilters;
    }

    private procesarRespuestaFiltrado(fullResponse: any) {
        console.log('Procesando respuesta completa:', fullResponse);
        const todosLosServicios = new Map();

        if (Array.isArray(fullResponse?.content)) {
            fullResponse.content.forEach((item: any) => {
                if (!todosLosServicios.has(item.id)) {
                    // Procesar los trabajos correctamente
                    const trabajosProcesados = Array.isArray(item.servicioTrabajos)
                        ? item.servicioTrabajos.map((servicioTrabajo: any) => ({
                            id: servicioTrabajo.id,
                            trabajo: {
                                id: servicioTrabajo.trabajo?.id,
                                descripcion: servicioTrabajo.trabajo?.descripcion,
                                descripcionTrabajo: servicioTrabajo.trabajo?.descripcionTrabajo || servicioTrabajo.trabajo?.descripcion || ''
                            }
                        }))
                        : [];

                    todosLosServicios.set(item.id, {
                        id: item.id,
                        descripcion: item.descripcion,
                        tipoServicio: {
                            id: item.tipoServicio?.id,
                            descripcion: item.tipoServicio?.descripcion,
                            descripcionTipoServicio: item.tipoServicio?.descripcionTipoServicio || item.tipoServicio?.descripcion || ''
                        },
                        estado: item.estado || { id: 1, descripcion: 'Activo' },
                        trabajos: trabajosProcesados
                    });
                }
            });
        }

        this.totalElements = fullResponse.totalElements || todosLosServicios.size;
        this.totalPages = fullResponse.totalPages || Math.ceil(this.totalElements / this.pageSize);
        this.dataSource = Array.from(todosLosServicios.values());

        console.log('DataSource procesado:', this.dataSource);
        this.cdr.detectChanges();
    }

    /* **********************************CRUD   - CREATE ***********************************/

    agregarServicio() {
        const dialogRef = this.dialog.open(ServicioFormComponent, {
            width: '400px',
            data: {
                esActualizar: false,
                object: {
                    estado: { id: 1, descripcion: 'Activo' }
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log("Datos recibidos del formulario:", result);
                this.obtenerDatos("id", "desc");
            }
        });
    }

    /*********************************** CRUD   - GET ***********************************/

    obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
        this.isLoading = true;

        const params = {
            pageSize: 20,
            pageNumber: 0,
            sortField: sortField,
            sortDirection: sortDirection,
            ...optionalFilter
        };

        console.log('Parámetros de búsqueda:', params);

        this.servicioService.buscarFiltradoAsignacion(params).subscribe((fullResponse: any) => {
            console.log('Respuesta completa inicial:', fullResponse);

            const todosLosServicios = new Map();
            if (Array.isArray(fullResponse?.content)) {
                fullResponse.content.forEach((item: any) => {
                    if (!todosLosServicios.has(item.id)) {
                        // Procesar los trabajos correctamente
                        const trabajosProcesados = Array.isArray(item.servicioTrabajos)
                            ? item.servicioTrabajos.map((servicioTrabajo: any) => ({
                                id: servicioTrabajo.id,
                                trabajo: {
                                    id: servicioTrabajo.trabajo?.id,
                                    descripcion: servicioTrabajo.trabajo?.descripcion,
                                    descripcionTrabajo: servicioTrabajo.trabajo?.descripcionTrabajo || servicioTrabajo.trabajo?.descripcion || ''
                                }
                            }))
                            : [];

                        todosLosServicios.set(item.id, {
                            id: item.id,
                            descripcion: item.descripcion,
                            tipoServicio: {
                                id: item.tipoServicio?.id,
                                descripcion: item.tipoServicio?.descripcion,
                                descripcionTipoServicio: item.tipoServicio?.descripcionTipoServicio || item.tipoServicio?.descripcion || ''
                            },
                            estado: item.estado || { id: 1, descripcion: 'Activo' },
                            trabajos: trabajosProcesados
                        });
                    }
                });
            }

            this.totalElements = todosLosServicios.size;
            this.totalPages = Math.ceil(this.totalElements / this.pageSize);

            let serviciosArray = Array.from(todosLosServicios.values());

            // Ordenamiento
            serviciosArray.sort((a: any, b: any) => {
                const getNestedValue = (obj: any, path: string) => {
                    return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
                };

                const valorA = getNestedValue(a, sortField);
                const valorB = getNestedValue(b, sortField);

                if (typeof valorA === 'string' && typeof valorB === 'string') {
                    return sortDirection === 'asc'
                        ? valorA.localeCompare(valorB)
                        : valorB.localeCompare(valorA);
                }

                if (sortDirection === 'asc') {
                    return valorA > valorB ? 1 : -1;
                } else {
                    return valorA < valorB ? 1 : -1;
                }
            });

            const inicio = this.pageNumber * this.pageSize;
            const fin = inicio + this.pageSize;
            this.dataSource = serviciosArray.slice(inicio, fin);

            console.log('DataSource final después de paginación:', this.dataSource);

            this.isLoading = false;
            this.cdr.detectChanges();
        }, error => {
            console.error('Error al obtener datos:', error);
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    /*********************************** CRUD   - DELETE ***********************************/
    eliminar(selectedItems: Servicio[]) {
        console.log('Método eliminar - Iniciando eliminación de múltiples items:', selectedItems);

        if (!selectedItems?.length) {
            console.log('Método eliminar - No hay items seleccionados para eliminar');
            return;
        }

        const ids = selectedItems
            .map(item => item.id)
            .filter((id): id is number => id !== undefined);

        console.log('Método eliminar - IDs filtrados para eliminar:', ids);

        if (ids.length === 0) {
            console.log('Método eliminar - No hay IDs válidos para eliminar');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.servicio.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: ids.length });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        console.log('Método eliminar - Abriendo diálogo de confirmación');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Método eliminar - Resultado del diálogo:', result);

            if (result) {
                console.log('Método eliminar - Iniciando llamada al servicio para eliminar IDs:', ids);

                this.servicioService.borrarLote(selectedItems).subscribe({
                    next: () => {
                        console.log('Método eliminar - Eliminación exitosa');
                        this.sharedTableComponent.clearSelection();

                        // Calculamos si después de la eliminación la página actual podría quedar vacía
                        const remainingItemsInPage = this.dataSource.length - ids.length;
                        if (remainingItemsInPage <= 0 && this.pageNumber > 0) {
                            this.pageNumber--; // Retrocedemos una página si la actual quedará vacía
                        }

                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: err => {
                        console.error("Error al eliminar elementos:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            } else {
                console.log('Método eliminar - Usuario canceló la eliminación');
            }
        });
    }

    onDeleteSingleSelected(id: string) {
        console.log('Método onDeleteSingleSelected - Iniciando eliminación de item con ID:', id);

        const servicio = this.dataSource.find(item => item.id === Number(id));
        console.log('Método onDeleteSingleSelected - Servicio encontrado:', servicio);

        const servicioId = servicio?.id;
        if (typeof servicioId !== 'number') {
            console.log('Método onDeleteSingleSelected - ID no válido');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.servicio.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        console.log('Método onDeleteSingleSelected - Abriendo diálogo de confirmación');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Método onDeleteSingleSelected - Resultado del diálogo:', result);

            if (result) {
                console.log('Método onDeleteSingleSelected - Iniciando proceso de eliminación');

                // Primero obtenemos todos los trabajos asociados al servicio
                const servicioTrabajos = servicio?.trabajos || [];

                // Si no hay trabajos, eliminamos directamente el servicio
                if (servicioTrabajos.length === 0) {
                    console.log('Método onDeleteSingleSelected - No hay trabajos, eliminando servicio directamente');

                    this.servicioService.borrar(servicioId)
                        .pipe(
                            catchError(err => {
                                console.error("Error al intentar eliminar el servicio:", err);
                                console.log('Intentando actualizar el estado del servicio a Cancelado...');

                                // Crear una copia del servicio con el estado actualizado
                                const servicioActualizado: Servicio = {
                                    id: servicioId,
                                    descripcion: servicio!.descripcion,
                                    tipoServicio: servicio!.tipoServicio,
                                    estado: { id: 2, descripcion: 'Cancelado' },
                                    trabajos: servicio!.trabajos || []
                                };

                                // Retornar el observable de actualización
                                return this.servicioService.actualizar(servicioId, servicioActualizado);
                            })
                        )
                        .subscribe({
                            next: () => {
                                console.log('Método onDeleteSingleSelected - Operación exitosa (eliminación o actualización)');
                                this.sharedTableComponent.clearSelection(); // Limpiamos la selección después de eliminar
                                this.obtenerDatos();
                                this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                            },
                            error: (finalErr) => {
                                console.error("Error en ambas operaciones:", finalErr);
                                this.toastr.error(this.translate.instant(convertErrorMessageToI18(finalErr)));
                            }
                        });
                    return;
                }

                // Si hay trabajos, primero eliminamos todos los trabajos
                console.log('Método onDeleteSingleSelected - Eliminando trabajos asociados');
                const deleteServicioTrabajos$ = servicioTrabajos
                    .filter((servicioTrabajo: ServicioTrabajo) => servicioTrabajo.trabajo?.id !== undefined)
                    .map((servicioTrabajo: ServicioTrabajo) =>
                        this.servicioTrabajoService.borrar(servicioId, servicioTrabajo.trabajo.id!)
                    );

                // Ejecutamos la eliminación de trabajos y luego el servicio en secuencia
                forkJoin(deleteServicioTrabajos$)
                    .pipe(
                        // Después de eliminar todos los trabajos, eliminamos el servicio
                        switchMap(() => this.servicioService.borrar(servicioId)),
                        catchError((error: unknown) => {
                            console.error("Error al intentar eliminar el servicio:", error);
                            console.log('Intentando actualizar el estado del servicio a Cancelado...');

                            // Crear una copia del servicio con el estado actualizado
                            const servicioActualizado: Servicio = {
                                id: servicioId,
                                descripcion: servicio!.descripcion,
                                tipoServicio: servicio!.tipoServicio,
                                estado: { id: 2, descripcion: 'Cancelado' },
                                trabajos: servicio!.trabajos || []
                            };

                            // Retornar el observable de actualización
                            return this.servicioService.actualizar(servicioId, servicioActualizado);
                        })
                    )
                    .subscribe({
                        next: () => {
                            console.log('Método onDeleteSingleSelected - Operación exitosa (eliminación o actualización)');
                            this.sharedTableComponent.clearSelection(); // Limpiamos la selección después de eliminar
                            this.obtenerDatos();
                            this.toastr.success(this.translate.instant('alertas.toastr.editar.success'));
                        },
                        error: (finalErr) => {
                            console.error("Error en ambas operaciones:", finalErr);
                            this.toastr.error(this.translate.instant(convertErrorMessageToI18(finalErr)));
                        }
                    });
            } else {
                console.log('Método onDeleteSingleSelected - Usuario canceló la eliminación');
            }
        });
    }

    onDeleteTrabajo(servicio: Servicio, trabajo: ServicioTrabajo) {
        console.log('Método onDeleteTrabajo - Iniciando eliminación de trabajo:', { servicio, trabajo });

        const servicioId = servicio?.id;
        if (typeof servicioId !== 'number') {
            console.log('Método onDeleteTrabajo - ID de servicio no válido');
            return;
        }

        const trabajoId = trabajo?.trabajo?.id;
        if (typeof trabajoId !== 'number') {
            console.log('Método onDeleteTrabajo - ID de trabajo no válido');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        console.log('Método onDeleteTrabajo - Abriendo diálogo de confirmación');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Método onDeleteTrabajo - Resultado del diálogo:', result);

            if (result) {
                console.log('Método onDeleteTrabajo - Iniciando llamada al servicio para eliminar trabajo:', trabajoId);

                this.servicioTrabajoService.borrar(servicioId, trabajoId).subscribe({
                    next: () => {
                        console.log('Método onDeleteTrabajo - Eliminación exitosa');
                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: err => {
                        console.error("Error al eliminar elementos:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            } else {
                console.log('Método onDeleteTrabajo - Usuario canceló la eliminación');
            }
        });
    }

    onClearTrabajos(servicio: Servicio) {
        console.log('Método onClearTrabajos - Iniciando limpieza de trabajos para servicio:', servicio);

        const servicioId = servicio?.id;
        if (typeof servicioId !== 'number') {
            console.log('Método onClearTrabajos - ID de servicio no válido');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.servicio.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        console.log('Método onClearTrabajos - Abriendo diálogo de confirmación');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Método onClearTrabajos - Resultado del diálogo:', result);

            if (result) {
                console.log('Método onClearTrabajos - Iniciando llamada al servicio para eliminar servicio con ID:', servicioId);

                this.servicioService.borrar(servicioId).subscribe({
                    next: () => {
                        console.log('Método onClearTrabajos - Eliminación exitosa');
                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: err => {
                        console.error("Error al eliminar elementos:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            } else {
                console.log('Método onClearTrabajos - Usuario canceló la eliminación');
            }
        });
    }

    onAsignacion(element: any): void {
        const dialogRef = this.dialog.open(ServicioTrabajoFormComponent, {
            width: '400px',
            data: {
                id: element.id,
                descripcion: element.descripcion
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerDatos();
            }
        });
    }

    onChipDelete(event: { parent: Servicio, item: ServicioTrabajo }) {
        console.log('Chip a eliminar:', event);
        const servicio = event.parent;
        const servicioTrabajo = event.item;

        if (!servicio || !servicioTrabajo || !servicioTrabajo.trabajo) {
            console.log('Datos inválidos para eliminar el trabajo');
            return;
        }

        const servicioId = servicio.id;
        const trabajoId = servicioTrabajo.trabajo.id;

        if (typeof servicioId !== 'number' || typeof trabajoId !== 'number') {
            console.log('IDs inválidos para eliminar el trabajo');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Eliminando trabajo:', trabajoId, 'del servicio:', servicioId);
                this.servicioTrabajoService.borrar(servicioId, trabajoId).subscribe({
                    next: () => {
                        console.log('Trabajo eliminado exitosamente');
                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: (err: unknown) => {
                        console.error('Error al eliminar el trabajo:', err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            }
        });
    }

    onChipsClear(event: Servicio) {
        console.log('Limpiar todos los trabajos del servicio:', event);
        const servicio = event;
        const trabajos = servicio?.trabajos || [];

        if (!servicio || trabajos.length === 0) {
            console.log('No hay trabajos para eliminar');
            return;
        }

        const servicioId = servicio.id;
        if (typeof servicioId !== 'number') {
            console.log('ID de servicio inválido');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionMultipleMensaje', { count: trabajos.length });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Eliminando todos los trabajos del servicio:', servicioId);

                // Crear un array de observables para cada trabajo a eliminar
                const deleteObservables = trabajos
                    .filter(trabajo => trabajo.trabajo?.id)
                    .map(trabajo => this.servicioTrabajoService.borrar(servicioId, trabajo.trabajo!.id!));

                if (deleteObservables.length === 0) {
                    console.log('No hay trabajos válidos para eliminar');
                    return;
                }

                // Ejecutar todas las eliminaciones en paralelo
                forkJoin(deleteObservables).subscribe({
                    next: () => {
                        console.log('Todos los trabajos eliminados exitosamente');
                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: (err: unknown) => {
                        console.error('Error al eliminar los trabajos:', err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            }
        });
    }

    onFilter(event: any) {
        // Implementa la lógica de filtrado
        console.log('Filter:', event);
    }

    onDelete(id: any) {
        // Implementa la lógica de eliminación
        console.log('Delete:', id);
    }

    onEdit(id: any) {
        // Implementa la lógica de edición
        console.log('Edit:', id);
    }

    /* * * * * * * * * * * *  CRUD   - UPDATE * * * * * * * * * * * * * * * * *  */
    onEditSelected(id: string) {
        const selectedObject = this.dataSource.find(item => item.id === Number(id));
        if (!selectedObject) {
            return;
        }
        console.log('Objeto seleccionado para editar:', selectedObject);
        const dialogRef = this.dialog.open(ServicioFormComponent, {
            width: '400px',
            data: {
                esActualizar: true,
                object: {
                    ...selectedObject,
                    estado: selectedObject.estado || { id: 1, descripcion: 'Activo' }
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerDatos("id", "desc");
            }
        });
    }

    onDeleteTarea(servicio: Servicio, servicioTrabajo: ServicioTrabajo, tarea: any) {
        console.log('Método onDeleteTarea - Iniciando eliminación de tarea:', { servicio, servicioTrabajo, tarea });

        const trabajoId = servicioTrabajo.trabajo?.id;
        if (typeof trabajoId !== 'number') {
            console.log('Método onDeleteTarea - ID de trabajo no válido');
            return;
        }

        const tareaId = tarea?.id;
        if (typeof tareaId !== 'number') {
            console.log('Método onDeleteTarea - ID de tarea no válido');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.tarea.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        console.log('Método onDeleteTarea - Abriendo diálogo de confirmación');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Método onDeleteTarea - Resultado del diálogo:', result);

            if (result) {
                console.log('Método onDeleteTarea - Iniciando llamada al servicio para eliminar tarea:', tareaId);

                this.trabajoTareaService.borrar(trabajoId, tareaId).subscribe({
                    next: () => {
                        console.log('Método onDeleteTarea - Eliminación exitosa');
                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: (err: unknown) => {
                        console.error("Error al eliminar elementos:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            } else {
                console.log('Método onDeleteTarea - Usuario canceló la eliminación');
            }
        });
    }

    onClearTareas(servicio: Servicio, servicioTrabajo: ServicioTrabajo) {
        console.log('Método onClearTareas - Iniciando limpieza de tareas para trabajo:', servicioTrabajo);

        const trabajoId = servicioTrabajo.trabajo?.id;
        if (typeof trabajoId !== 'number') {
            console.log('Método onClearTareas - ID de trabajo no válido');
            return;
        }

        const servicioId = servicio.id;
        if (typeof servicioId !== 'number') {
            console.log('Método onClearTareas - ID de servicio no válido');
            return;
        }

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        console.log('Método onClearTareas - Abriendo diálogo de confirmación');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Método onClearTareas - Resultado del diálogo:', result);

            if (result) {
                console.log('Método onClearTareas - Iniciando llamada al servicio para eliminar trabajo con ID:', trabajoId);

                this.servicioTrabajoService.borrar(servicioId, trabajoId).subscribe({
                    next: () => {
                        console.log('Método onClearTareas - Eliminación exitosa');
                        this.obtenerDatos();
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                    },
                    error: (err: unknown) => {
                        console.error("Error al eliminar elementos:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            } else {
                console.log('Método onClearTareas - Usuario canceló la eliminación');
            }
        });
    }

}