import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedTableComponent } from "../../../shared/components/shared-table/shared-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { ContactoService } from "../../../core/services/contacto.service";
import { Contacto } from "../../../core/models/contacto.model";
import { catchError, tap, throwError } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { BusquedaGenericaComponent } from "../../../shared/components/busqueda-generica/busqueda-generica.component";
import { ContactosClienteCrearComponent } from "../../../shared/components/sub-forms/contactos-cliente-crear/contactos-cliente-crear.component";
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TituloDialogoComponent } from "../../../shared/components/titulo-dialogo/titulo-dialogo.component";

@Component({
    selector: "app-contacto-cliente",
    standalone: true,
    imports: [CommonModule, SharedTableComponent, MatIconModule, HeadTableComponent, BusquedaGenericaComponent, MatPaginatorModule, OpcionesMantenedorComponent, TranslateModule],
    templateUrl: "./contacto-cliente.component.html"
})
export class ContactoClienteComponent implements OnInit {
    displayedColumns: string[] = []; // Se inicializa vacío
    dataSource: Contacto[] = []; // Ahora usa la interfaz Contacto
    titulo: string = 'Contacto'; // Puedes cambiarlo dinámicamente
    hasSelection = false;
    selectedData: any[] = []; // Almacena la data seleccionada
    dataForBusqueda: any[] = [];
    pageNumber = 0
    totalPages = 0
    pageSize = 10;
    showDiv: boolean = false;
    totalElements = 0;
    isLoading = false; // Variable para controlar el estado de carga
    currentSortState: { column: string; direction: string } | null = null;
    currentFilters: any = {}; // Variable para mantener los filtros actuales
    @ViewChild(SharedTableComponent) sharedTableComponent!: SharedTableComponent;
    activeOptionalFilters: any = [];

    @Output() agregarContactoPressed = new EventEmitter<void>();

    constructor(private cdr: ChangeDetectorRef,
        private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
        private translate: TranslateService, private toastr: ToastrService,
        private contactoService: ContactoService) { }

    ngOnInit() {
        this.obtenerDatos();
    }


    /********************************** TABLA - SHARED TABLE **********************************/
    onSelectionChange(selectedItems: any[]) {
        this.hasSelection = selectedItems.length > 0;
        this.selectedData = selectedItems; // Guardamos la data seleccionada
    }

    onViewSelected(id: string): void {
        const dialogRef = this.dialog.open(ContactoFormComponent, {
            width: '400px',
            data: {
                esActualizar: true,
                object: this.dataSource.find(item => item.id === Number(id))
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

            let columnKeys = Object.keys(dataArray[0]);
            if (translationBase === 'mantenedores.contacto') {
                columnKeys = columnKeys.filter(key => key !== 'id');
            }

            const translationKeys = columnKeys.map(key => `${translationBase}.${key}`);

            this.translate.get(translationKeys).subscribe(translations => {
                const translatedData = dataArray.map(item => {
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
            handleExport(this.selectedData, 'mantenedores.contacto');
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

            this.contactoService.buscarFiltrado(filtros).subscribe(
                (response: any) => {
                    const apiData = response?.content ?? response?.data ?? [];
                    console.log("CAMINO 2.1: Datos recibidos de API - Cantidad:", apiData.length);

                    if (apiData.length === 0) {
                        console.error("Error: La API no devolvió datos.");
                        this.toastr.error("No hay datos disponibles para exportar.");
                        return;
                    }

                    handleExport(apiData, 'mantenedores.contacto');
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
        this.currentSortState = {
            column: sortData.selectedColumnName,
            direction: sortData.currentSortType
        };
        this.obtenerDatos(sortData.selectedColumnName, sortData.currentSortType, this.currentFilters);
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
        console.log('Método buscar llamado con:', data);
        this.activeOptionalFilters = data.labels;
        this.currentFilters = data.filter; // Guardar los filtros actuales
        console.log("Data filter:", data.filter);

        // Al aplicar filtros, resetear el ordenamiento
        this.currentSortState = null;
        this.obtenerDatos("id", "asc", data.filter);
    }

    onFilterDelete(filterData: { field: string, value: string }) {
        console.log('Eliminando filtro:', filterData);

        // Actualizar los filtros activos
        console.log("Filtros activos antes de eliminar:", this.activeOptionalFilters);
        this.activeOptionalFilters = this.activeOptionalFilters.filter(
            (filter: { field: string, value: string, id: any }) => {
                if (filter?.id) {
                    return !(filter.field === filterData.field && filter.id === filterData.value);
                } else {
                    return !(filter.field === filterData.field && filter.value === filterData.value);
                }
            }
        );

        console.log("Filtros activos:", this.activeOptionalFilters);

        // Reconstruir el objeto de filtro
        const newFilter: any = {};
        this.activeOptionalFilters.forEach((filter: { field: string, value: string, id: any }) => {
            if (filter.id && filter.id !== null) {
                newFilter[filter.field] = filter.id;
            } else {
                newFilter[filter.field] = filter.value;
            }
        });

        this.currentFilters = newFilter; // Actualizar los filtros actuales
        console.log("Filtros finales:", newFilter);

        // Si no hay filtros activos, resetear el ordenamiento
        if (Object.keys(newFilter).length === 0) {
            this.currentSortState = null;
        }

        // Obtener datos con los nuevos filtros
        this.obtenerDatos("id", "asc", newFilter);
    }

    /********************************** TABLA - SHARED TABLE **********************************/


    /*********************************** CRUD   - GET ***********************************/

    obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
        console.log('obtenerDatos llamado con filtros:', optionalFilter);
        console.log('Estado actual del ordenamiento:', this.currentSortState);
        console.log('Filtros actuales:', this.currentFilters);

        // Activar el estado de carga
        this.isLoading = true;

        const mandatoryFilter = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortField: sortField,
            sortDirection: sortDirection,
            ...optionalFilter
        }

        console.log('Filtros finales para la API:', mandatoryFilter);

        this.contactoService.buscarFiltrado(mandatoryFilter).subscribe(
            (data: PagedResponse<Contacto[]>) => {
                console.log("Datos recibidos:", data);

                this.pageNumber = data.pageNumber
                this.totalPages = data.totalPages
                this.pageSize = data.pageSize;
                this.totalElements = data.totalElements;

                this.dataSource = data.content.flat();
                if (data.content.length > 0) {
                    this.displayedColumns = Object.keys(data.content[0]);
                }

                // Desactivar el estado de carga
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error => {
                console.error('Error al obtener datos:', error);
                // Desactivar el estado de carga en caso de error
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        );
    }

    /*********************************** CRUD   - DELETE ***********************************/
    eliminar(selectedItems: Contacto[]) {
        const count = selectedItems.length;

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo');
        const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count });
        const textoBotonCancelar = this.translate.instant('alertas.cancelar');
        const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

        const dialogRef = this.dialog.open(DialogAlertaComponent, {
            width: '600px',
            height: '400px',
            data: {
                titulo: titulo,
                mensaje: mensaje,
                textoBotonCancelar: textoBotonCancelar,
                textoBotonConfirmar: textoBotonConfirmar
            }
        });

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) {
                const ids = selectedItems.map(item => item.id);
                console.log("Datos a enviar para eliminar:", ids);

                this.contactoService.borrarTodos(ids as number[]).subscribe({
                    next: () => {
                        console.log("Elementos eliminados exitosamente:", selectedItems);

                        // Limpiar selecciones primero
                        this.selectedData = [];
                        this.hasSelection = false;
                        if (this.sharedTableComponent) {
                            this.sharedTableComponent.clearSelection();
                        }

                        // Actualizar datos
                        this.dataSource = this.dataSource.filter(item => !selectedItems.some(si => si.id === item.id));

                        // Actualizar las propiedades de paginación
                        this.totalElements -= selectedItems.length;
                        this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 0;

                        // Ajustar pageNumber si es necesario
                        if (this.pageNumber >= this.totalPages && this.totalPages > 0) {
                            this.pageNumber = this.totalPages - 1;
                        }

                        // Recargar los datos manteniendo el estado de ordenamiento y filtros
                        if (this.currentSortState) {
                            this.obtenerDatos(this.currentSortState.column, this.currentSortState.direction, this.currentFilters);
                        } else {
                            this.obtenerDatos("id", "asc", this.currentFilters);
                        }

                        // Mostrar mensaje de éxito
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));

                        // Forzar la detección de cambios
                        this.cdr.detectChanges();
                    },
                    error: err => {
                        console.error("Error al eliminar elementos:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            }
        });
    }

    onDeleteSingleSelected(id: string) {
        console.log("Eliminar seleccionado:", id);

        // Obtener las traducciones
        const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.contacto.titulo');
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

        dialogRef.afterClosed().subscribe(confirmado => {
            if (confirmado) {
                console.log("Eliminando elemento con ID:", id);

                this.contactoService.borrar(Number(id)).subscribe({
                    next: () => {
                        console.log("Elemento eliminado exitosamente:", id);

                        // Filtrar el item eliminado del dataSource
                        this.dataSource = this.dataSource.filter(item => item.id !== Number(id));

                        // Actualizar propiedades de paginación
                        this.totalElements -= 1;
                        this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 0;

                        // Ajustar pageNumber si es necesario
                        if (this.pageNumber >= this.totalPages && this.totalPages > 0) {
                            this.pageNumber = this.totalPages - 1;
                        }

                        // Recargar datos manteniendo el estado de ordenamiento y filtros
                        if (this.currentSortState) {
                            this.obtenerDatos(this.currentSortState.column, this.currentSortState.direction, this.currentFilters);
                        } else {
                            this.obtenerDatos("id", "asc", this.currentFilters);
                        }

                        // Mostrar mensaje de éxito
                        this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));

                        // Limpiar selección si existe un componente compartido
                        if (this.sharedTableComponent) {
                            this.sharedTableComponent.selection.clear();
                        }

                        // Debug: Estado del paginador después de eliminar
                        console.log("Estado del paginador después de eliminar:", {
                            pageNumber: this.pageNumber,
                            totalElements: this.totalElements,
                            totalPages: this.totalPages,
                            currentFilters: this.currentFilters,
                            currentSortState: this.currentSortState
                        });
                    },
                    error: (err: any) => {
                        console.error("Error al eliminar elemento:", err);
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
                    }
                });
            }
        });
    }

    /* **********************************CRUD   - CREATE ***********************************/

    agregarContacto() {
        this.agregarContactoPressed.emit();
    }


    /* * * * * * * * * * * *  CRUD   - UPDATE * * * * * * * * * * * * * * * * *  */
    onEditSelected(id: string) {
        const selectedObject = this.dataSource.find(item => item.id === Number(id));
        if (!selectedObject) {
            return;
        }
        const dialogRef = this.dialog.open(ContactoFormComponent, {
            width: '400px',
            data: {
                esActualizar: true,
                object: selectedObject
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.obtenerDatos("id", "desc");
            }
        });
    }

    onDataEmitted(data: any[]) {
        this.dataForBusqueda = data;
        // Aquí podrías hacer algún procesamiento adicional si es necesario.
    }
}

// Componente para formulario de contacto
@Component({
    selector: 'app-contacto-form',
    template: `
    <div>
      <app-titulo-dialogo [title]="(data.esActualizar ? 'mantenedores.formularios.contacto.tituloEditar' : 'mantenedores.formularios.contacto.tituloAgregar') | translate" icon="contacts" [ref]="dialogRef"></app-titulo-dialogo>
      <mat-dialog-content class="relative dark:bg-neutral-800">
        <app-contactos-cliente-crear #contactoForm></app-contactos-cliente-crear>
        <mat-dialog-actions align="end">
          <div class="grid grid-cols-2 gap-4 w-full">
            <button (click)="dialogRef.close()" class="elitsoft-warn w-full flex items-center justify-center py-2 text-center">
              {{ 'mantenedores.formularios.botonCancelar' | translate }}
            </button>
            <button (click)="guardar()" class="elitsoft-btn w-full flex items-center justify-center py-2 text-center">
              {{ (data.esActualizar ? 'mantenedores.formularios.actualizar' : 'mantenedores.formularios.guardar') | translate }}
            </button>
          </div>
        </mat-dialog-actions>
      </mat-dialog-content>
    </div>
  `,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        TranslateModule,
        MatDialogContent,
        MatDialogActions,
        TituloDialogoComponent,
        ContactosClienteCrearComponent
    ]
})
export class ContactoFormComponent implements OnInit {
    @ViewChild('contactoForm') contactoForm: any;

    constructor(
        public dialogRef: MatDialogRef<ContactoFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private contactoService: ContactoService,
        private toastr: ToastrService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        if (this.data && this.data.esActualizar && this.data.object) {
            // Aquí iría la lógica para cargar los datos del contacto en el formulario
        }
    }

    guardar() {
        if (this.contactoForm && this.contactoForm.form.valid) {
            const contactoData = this.contactoForm.form.value;

            // Si es actualización
            if (this.data && this.data.esActualizar) {
                this.contactoService.actualizar(this.data.object.id, contactoData).subscribe({
                    next: (result) => {
                        this.toastr.success(this.translate.instant('alertas.toastr.actualizar.success'));
                        this.dialogRef.close(true);
                    },
                    error: (error) => {
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                    }
                });
            }
            // Si es creación
            else {
                this.contactoService.crear(contactoData).subscribe({
                    next: (result) => {
                        this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
                        this.dialogRef.close(true);
                    },
                    error: (error) => {
                        this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
                    }
                });
            }
        } else {
            this.toastr.error(this.translate.instant('alertas.toastr.formulario.error'));
        }
    }
}
