import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedTableV2Component } from "../../../shared/components/shared-table-v2/shared-table-v2.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TrabajoFormComponent } from "../../../shared/components/forms/trabajo.component";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { TrabajoTareaService } from "../../../core/services/trabajo-tarea.service";
import { TrabajoTarea } from "../../../core/models/trabajo-tarea.model";
import { catchError, tap, throwError } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { BusquedaGenericaComponent } from "../../../shared/components/busqueda-generica/busqueda-generica.component";
import { TrabajoTareaFormComponent } from "../../../shared/components/forms/trabajo-tarea.component";
import { TrabajoService } from "../../../core/services/trabajo.service";
import { Trabajo } from "../../../core/models/trabajo.model";

@Component({
  selector: "app-trabajo",
  standalone: true,
  imports: [CommonModule, SharedTableV2Component, MatIconModule, HeadTableComponent, MatPaginatorModule, OpcionesMantenedorComponent, TranslateModule, BusquedaGenericaComponent],
  templateUrl: "./trabajo.component.html",
  styleUrl: "./trabajo.component.css",
})
export class TrabajoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'descripcionTrabajo', 'trabajoTareas']; // Columnas que queremos mostrar
  dataSource: Trabajo[] = []; // Cambiado a Trabajo[]
  titulo: string = 'Trabajo';
  hasSelection = false;
  selectedData: any[] = [];
  pageNumber = 0;
  totalPages = 0;
  pageSize = 10;
  totalElements = 0;
  isLoading = false;
  @ViewChild(SharedTableV2Component) sharedTableComponent!: SharedTableV2Component;
  activeOptionalFilters: any = [];
  constructor(private cdr: ChangeDetectorRef,
    private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
    private translate: TranslateService, private toastr: ToastrService,
    private trabajoTareaService: TrabajoTareaService, private trabajoService: TrabajoService) { }

  ngOnInit() {
    this.obtenerDatos();
  }


  /********************************** TABLA - SHARED TABLE **********************************/
  onSelectionChange(selectedItems: any[]) {
    this.hasSelection = selectedItems.length > 0;
    this.selectedData = selectedItems; // Guardamos la data seleccionada
  }



  onViewSelected(id: string): void {
    const dialogRef = this.dialog.open(TrabajoFormComponent, {
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
      if (translationBase === 'mantenedores.trabajo') {
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
      handleExport(this.selectedData, 'mantenedores.trabajo');
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

      this.trabajoTareaService.buscarFiltrado(filtros).subscribe(
        (response: any) => {
          const apiData = response?.content ?? response?.data ?? [];
          console.log("CAMINO 2.1: Datos recibidos de API - Cantidad:", apiData.length);

          if (apiData.length === 0) {
            console.error("Error: La API no devolvió datos.");
            this.toastr.error("No hay datos disponibles para exportar.");
            return;
          }

          handleExport(apiData, 'mantenedores.trabajo');
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
    this.obtenerDatos(sortData.selectedColumnName, sortData.currentSortType);
  }

  onPageChanged(newPage: number) {
    console.log("Página cambiada", newPage);
    this.pageNumber = newPage
    this.obtenerDatos();
  }


  buscar(data: { filter: any, labels: any[] }) {
    console.log('Search input:', data);
    this.pageNumber = 0;
    this.activeOptionalFilters = data.labels || [];
    this.obtenerDatos("id", "asc", data.filter);
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
    this.obtenerDatos("id", "asc", newFilter);
  }



  /********************************** TABLA - SHARED TABLE **********************************/


  /*********************************** CRUD   - GET ***********************************/




  obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
    this.isLoading = true;
    const filtros = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: sortField,
      sortDirection: sortDirection,
      ...optionalFilter
    };

    this.trabajoService.buscarFiltrado(filtros)
      .pipe(
        tap((response: any) => {
          // Asegurarse de que trabajoTareas esté presente
          this.dataSource = (response?.content || []).map((trabajo: Trabajo) => ({
            ...trabajo,
            trabajoTareas: trabajo.trabajoTareas || []
          }));
          this.totalElements = response?.totalElements || 0;
          this.totalPages = response?.totalPages || 0;
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
        catchError(error => {
          this.isLoading = false;
          this.cdr.detectChanges();
          return throwError(() => error);
        })
      ).subscribe();
  }




  /*********************************** CRUD   - DELETE ***********************************/
  eliminar(selectedItems: Trabajo[]) {
    if (!selectedItems?.length) return;

    const ids = selectedItems
      .map(item => item.id)
      .filter((id): id is number => id !== undefined);

    if (ids.length === 0) return;

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: this.translate.instant('alertas.eliminar.titulo'),
        mensaje: this.translate.instant('alertas.eliminar.mensaje'),
        aceptar: true,
        cancelar: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trabajoService.borrarLote(ids).subscribe({
          next: () => {
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: (error) => {
            const errorMessage = convertErrorMessageToI18(error);
            this.toastr.error(this.translate.instant(errorMessage));
          }
        });
      }
    });
  }

  onDeleteSingleSelected(id: string) {
    const trabajo = this.dataSource.find(item => item.id === Number(id));
    const trabajoId = trabajo?.id;
    if (typeof trabajoId !== 'number') return;

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: this.translate.instant('alertas.eliminar.titulo'),
        mensaje: this.translate.instant('alertas.eliminar.mensaje'),
        aceptar: true,
        cancelar: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trabajoService.borrar(trabajoId).subscribe({
          next: () => {
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: (error) => {
            const errorMessage = convertErrorMessageToI18(error);
            this.toastr.error(this.translate.instant(errorMessage));
          }
        });
      }
    });
  }

  /* **********************************CRUD   - CREATE ***********************************/

  agregarServicio() {
    const dialogRef = this.dialog.open(TrabajoFormComponent, {
      width: '400px',
      data: {
        esActualizar: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Datos recibidos del formulario:", result);
        this.obtenerDatos("id", "desc");
      }
    });
  }


  /* * * * * * * * * * * *  CRUD   - UPDATE * * * * * * * * * * * * * * * * *  */
  onEditSelected(id: string) {
    const trabajo = this.dataSource.find(item => item.id === Number(id));
    if (!trabajo) return;

    const dialogRef = this.dialog.open(TrabajoFormComponent, {
      width: '400px',
      data: {
        esActualizar: true,
        object: trabajo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerDatos();
      }
    });
  }

  onDeleteTarea(trabajo: Trabajo, tarea: any) {
    const trabajoId = trabajo?.id;
    if (typeof trabajoId !== 'number') return;

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: this.translate.instant('alertas.eliminar.titulo'),
        mensaje: this.translate.instant('alertas.eliminar.mensaje'),
        aceptar: true,
        cancelar: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trabajoService.borrar(trabajoId).subscribe({
          next: () => {
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: (error) => {
            const errorMessage = convertErrorMessageToI18(error);
            this.toastr.error(this.translate.instant(errorMessage));
          }
        });
      }
    });
  }

  onClearTareas(trabajo: Trabajo) {
    const trabajoId = trabajo?.id;
    if (typeof trabajoId !== 'number') return;

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: this.translate.instant('alertas.eliminar.titulo'),
        mensaje: this.translate.instant('alertas.eliminar.mensaje'),
        aceptar: true,
        cancelar: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trabajoService.borrar(trabajoId).subscribe({
          next: () => {
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: (error) => {
            const errorMessage = convertErrorMessageToI18(error);
            this.toastr.error(this.translate.instant(errorMessage));
          }
        });
      }
    });
  }

  onAsignacion(element: any): void {
    const dialogRef = this.dialog.open(TrabajoTareaFormComponent, {
      width: '400px',
      data: {
        id: element.id,
        descripcionTrabajo: element.descripcionTrabajo,
        trabajoTareas: element.trabajoTareas || []
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

}