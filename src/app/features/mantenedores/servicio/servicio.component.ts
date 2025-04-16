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
import { catchError, tap, throwError, forkJoin, map, of, switchMap } from "rxjs";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { BusquedaGenericaComponent } from "../../../shared/components/busqueda-generica/busqueda-generica.component";
import { ServicioService } from "../../../core/services/servicio.service";
import { Servicio } from "../../../core/models/servicio.model";
import { ServicioFormComponent } from "../../../shared/components/forms/servicio.component";
import { ServicioTrabajoFormComponent } from "../../../shared/components/forms/servicio-trabajo.component";

@Component({
    selector: "app-servicio",
    standalone: true,
    imports: [CommonModule, SharedTableV2Component, MatIconModule, HeadTableComponent, MatPaginatorModule, OpcionesMantenedorComponent, TranslateModule, BusquedaGenericaComponent],
    templateUrl: "./servicio.component.html",

})
export class ServicioComponent implements OnInit {
    displayedColumns: string[] = ['id', 'descripcion', 'tipoServicio', 'estado', 'trabajos'];
    isLoading = false;
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
                nestedPath: 'trabajo.descripcion',
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
        private servicioTrabajoService: ServicioTrabajoService, private servicioService: ServicioService) { }

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
                const formattedItem: any = {
                    id: item.id,
                    descripcion: item.descripcion,
                    tipoServicio: item.tipoServicio?.descripcionTipoServicio || '',
                    estado: item.estado?.descripcion || 'Activo',
                    trabajos: item.trabajos ? item.trabajos.map((t: any) => t.trabajo?.descripcion).join(', ') : ''
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

            this.servicioService.buscarFiltrado(filtros).subscribe(
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
            'fechaCreacion': 'fechaCreacion',
            'fechaModificacion': 'fechaModificacion',
            'estado': 'estado.descripcion',
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
        console.log('Deleting filter:', filterData);
        this.activeOptionalFilters = this.activeOptionalFilters.filter(
            (filter: { field: string, value: string }) => !(filter.field === filterData.field && filter.value === filterData.value)
        );
        const newFilter = this.activeOptionalFilters.reduce((acc: any, filter: { field: string, value: string }) => {
            acc[filter.field] = filter.value;
            return acc;
        }, {});
        this.currentFilters = newFilter;
        // Mantener el ordenamiento actual si existe
        if (this.currentSortState) {
            this.obtenerDatos(this.currentSortState.column, this.currentSortState.direction, newFilter);
        } else {
            this.obtenerDatos("id", "asc", newFilter);
        }
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

        // Configurar los parámetros de la llamada a la API incluyendo los filtros
        const params = {
            pageSize: 20,
            pageNumber: 0,
            sortField: 'id',
            sortDirection: 'asc',
            ...optionalFilter // Incluir los filtros adicionales
        };

        console.log('Parámetros de búsqueda:', params);

        // Primera llamada para obtener todos los servicios y contar el total real
        this.servicioService.buscarFiltrado(params).subscribe((fullResponse: any) => {
            console.log('Respuesta completa inicial:', fullResponse);

            // Obtenemos todos los servicios únicos
            const todosLosServicios = new Map();
            if (Array.isArray(fullResponse?.content)) {
                fullResponse.content.forEach((item: any) => {
                    if (!todosLosServicios.has(item.id)) {
                        todosLosServicios.set(item.id, {
                            id: item.id,
                            descripcion: item.descripcion,
                            tipoServicio: item.tipoServicio || {},
                            estado: item.estado || { id: 1, descripcion: 'Activo' },
                            trabajos: Array.isArray(item.trabajos) ? [...item.trabajos] : []
                        });
                    }
                });
            }

            // Calculamos el total real de elementos y páginas
            this.totalElements = todosLosServicios.size;
            this.totalPages = Math.ceil(this.totalElements / this.pageSize);

            console.log('Total real de servicios:', this.totalElements);
            console.log('Total de páginas:', this.totalPages);

            // Convertimos el Map a array y aplicamos ordenamiento
            let serviciosArray = Array.from(todosLosServicios.values());

            // Ordenamos el array según el campo y dirección especificados
            serviciosArray.sort((a: any, b: any) => {
                const valorA = a[sortField];
                const valorB = b[sortField];

                if (sortDirection === 'asc') {
                    return valorA > valorB ? 1 : -1;
                } else {
                    return valorA < valorB ? 1 : -1;
                }
            });

            // Aplicamos paginación en memoria
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
                    this.servicioService.borrar(servicioId).subscribe({
                        next: () => {
                            console.log('Método onDeleteSingleSelected - Eliminación exitosa');
                            this.sharedTableComponent.clearSelection(); // Limpiamos la selección después de eliminar
                            this.obtenerDatos();
                            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                        },
                        error: (error: unknown) => {
                            console.error("Error al eliminar servicio:", error);
                            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
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
                            console.error("Error al eliminar elementos:", error);
                            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                            return throwError(() => error);
                        })
                    )
                    .subscribe({
                        next: () => {
                            console.log('Método onDeleteSingleSelected - Eliminación exitosa');
                            this.sharedTableComponent.clearSelection(); // Limpiamos la selección después de eliminar
                            this.obtenerDatos();
                            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
                        },
                        error: (error: unknown) => {
                            console.error("Error al eliminar elementos:", error);
                            this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
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

    onChipDelete(event: { parent: any, item: any }) {
        // Implementa la lógica para eliminar un chip
        console.log('Chip deleted:', event);
    }

    onChipsClear(event: any) {
        // Implementa la lógica para limpiar todos los chips
        console.log('Chips cleared:', event);
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
}