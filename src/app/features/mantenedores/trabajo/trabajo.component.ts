import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedTableComponent } from "../../../shared/components/shared-table/shared-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TrabajoFormComponent } from "../../../shared/components/forms/trabajo.component";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { TrabajoService } from "../../../core/services/trabajo.service";
import { Trabajo } from "../../../core/models/trabajo.model";
import { catchError, tap, throwError } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { BusquedaGenericaComponent } from "../../../shared/components/busqueda-generica/busqueda-generica.component";

@Component({
  selector: "app-trabajo",
  standalone: true,
  imports: [CommonModule, SharedTableComponent, MatIconModule, HeadTableComponent, MatPaginatorModule, OpcionesMantenedorComponent, TranslateModule, BusquedaGenericaComponent],
  templateUrl: "./trabajo.component.html",
  styleUrl: "./trabajo.component.css",
})
export class TrabajoComponent implements OnInit {
  displayedColumns: string[] = []; // Se inicializa vacío
  dataSource: Trabajo[] = []; // Ahora usa la interfaz trabajo
  titulo: string = 'Trabajo'; // Puedes cambiarlo dinámicamente
  hasSelection = false;
  selectedData: any[] = []; // Almacena la data seleccionada
  pageNumber = 0
  totalPages = 0
  pageSize = 10;
  totalElements = 0;
  @ViewChild(SharedTableComponent) sharedTableComponent!: SharedTableComponent;
  activeOptionalFilters: any = [];
  constructor(private cdr: ChangeDetectorRef,
    private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
    private translate: TranslateService, private toastr: ToastrService,
    private trabajoService: TrabajoService) { }

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

      this.trabajoService.buscarFiltrado(filtros).subscribe(
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
    const mandatoryFilter = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: sortField,
      sortDirection: sortDirection,
      ...optionalFilter
    }

    this.trabajoService.buscarFiltrado(mandatoryFilter).subscribe((data: PagedResponse<Trabajo[]>) => {
      console.log("Datos recibidos:", data);

      this.pageNumber = data.pageNumber
      this.totalPages = data.totalPages
      this.pageSize = data.pageSize;
      this.totalElements = data.totalElements;

      this.activeOptionalFilters = Object.entries(optionalFilter).map(([field, value]) => ({ field, value }));
      this.activeOptionalFilters = this.activeOptionalFilters.filter((ao: any) => ao.value)
      this.dataSource = data.content.flat();
      if (data.content.length > 0) {
        this.displayedColumns = Object.keys(data.content[0]);
      }
      this.cdr.detectChanges();
    });
  }






  /*********************************** CRUD   - DELETE ***********************************/
  eliminar(selectedItems: Trabajo[]) {
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
        console.log("Datos a enviar para eliminar:", { ids: ids });

        this.trabajoService.borrarTodos(ids).subscribe({
          next: () => {
            console.log("Elementos eliminados exitosamente:", ids);
            this.dataSource = this.dataSource.filter(item => !ids.includes(item.id));
            this.hasSelection = false;

            // Actualizar las propiedades de paginación
            this.totalElements -= ids.length;
            this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 0;

            // Ajustar pageNumber si es necesario
            if (this.pageNumber >= this.totalPages && this.totalPages > 0) {
              this.pageNumber = this.totalPages - 1; // Ir a la última página disponible
            }

            // Recargar los datos
            this.obtenerDatos();

            // Mostrar mensaje de éxito
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));

            // Limpiar selecciones en el componente hijo
            if (this.sharedTableComponent) {
              this.sharedTableComponent.selection.clear();
            }

            // Depurar el estado del paginador
            console.log("Estado del paginador después de eliminar:", {
              pageNumber: this.pageNumber,
              totalElements: this.totalElements,
              totalPages: this.totalPages
            });
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

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        console.log("Eliminando elemento con ID:", id);

        this.trabajoService.borrar(Number(id)).subscribe({
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

            // Recargar datos
            this.obtenerDatos();

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
              totalPages: this.totalPages
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
    const selectedObject = this.dataSource.find(item => item.id === Number(id));
    if (!selectedObject) {
      return;
    }
    const dialogRef = this.dialog.open(TrabajoFormComponent, {
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



}