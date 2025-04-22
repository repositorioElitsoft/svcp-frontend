import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedTableV2Component } from "../../../shared/components/shared-table-v2/shared-table-v2.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TipoProductoFormComponent } from "../../../shared/components/forms/tipo-producto.component";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { TipoProductoService } from "../../../core/services/tipo-producto.service";
import { TipoProducto } from "../../../core/models/tipo-producto.model";
import { catchError, tap, throwError, forkJoin, map, of, switchMap } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { convertErrorMessageToI18 } from "../../../core/utils/errors.utils"
import { BusquedaGenericaComponent } from "../../../shared/components/busqueda-generica/busqueda-generica.component";
import { TipoProductoTipoComponenteService } from "../../../core/services/tipo-producto-tipo-componente.service";
import { TipoProductoTipoComponente } from "../../../core/models/tipo-producto-tipo.componente.model";
import { TipoProductoViewComponent } from "../../../shared/components/forms/tipo-producto-view.component";

@Component({
  selector: "app-tipo-producto",
  standalone: true,
  imports: [CommonModule, SharedTableV2Component, MatIconModule, HeadTableComponent, MatPaginatorModule, OpcionesMantenedorComponent, TranslateModule, BusquedaGenericaComponent],
  templateUrl: "./tipo-producto.component.html",
  styleUrl: "./tipo-producto.component.css",
})
export class TipoProductoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'descripcionTipoProducto', 'tipoProductoTipoComponentes'];
  columnConfig: {
    field: string;
    type: 'text' | 'chips' | 'custom';
    nestedPath?: string;
    displayField?: string;
    customTemplate?: TemplateRef<any>;
    sortable?: boolean;
  }[] = [
      { field: 'id', type: 'text' },
      { field: 'descripcionTipoProducto', type: 'text' },
      {
        field: 'tipoProductoTipoComponentes',
        type: 'chips',
        nestedPath: 'tipoComponente.nombre',
        displayField: 'tipoComponente.nombre',
        sortable: false
      }
    ];
  dataSource: TipoProducto[] = [];
  titulo: string = 'Tipo Producto';
  hasSelection = false;
  selectedData: any[] = [];
  pageNumber = 0;
  totalPages = 0;
  pageSize = 10;
  totalElements = 0;
  isLoading = false;
  @ViewChild(SharedTableV2Component) sharedTableComponent!: SharedTableV2Component;
  activeOptionalFilters: any = [];
  currentFilters: any = {};
  currentSortState: { column: string, direction: string } | null = null;


  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private exportService: ExportarDocService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private tipoProductoService: TipoProductoService,
    private tipoProductoTipoComponenteService: TipoProductoTipoComponenteService
  ) { }

  ngOnInit() {
    this.obtenerDatos();
  }

  onSelectionChange(selectedItems: any[]) {
    this.hasSelection = selectedItems.length > 0;
    this.selectedData = selectedItems;
  }

  onViewSelected(id: string): void {
    const dialogRef = this.dialog.open(TipoProductoFormComponent, {
      width: '450px',
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

  exportarExcel(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
    const handleExport = (dataArray: any[], translationBase: string) => {
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        console.error("Error: No hay datos para exportar en handleExport.");
        return;
      }

      const formattedData = dataArray.map(item => {
        const formattedItem: any = {
          id: item.id,
          descripcionTipoProducto: item.descripcionTipoProducto,
          componentes: item.tipoProductoTipoComponentes ? item.tipoProductoTipoComponentes
            .sort((a: any, b: any) => a.ordenEjecucionTipoComponente - b.ordenEjecucionTipoComponente)
            .map((tt: any) => tt.tipoComponente.descripcionTipoComponente)
            .join(', ') : ''
        };
        return formattedItem;
      });

      const columnKeys = ['descripcionTipoProducto', 'componentes'];
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

        this.translate.get(`${translationBase}.titulo`).subscribe(title => {
          this.exportService.exportToExcel(translatedData, title);
        });
      });
    };

    if (this.selectedData && Array.isArray(this.selectedData) && this.selectedData.length > 0) {
      handleExport(this.selectedData, 'mantenedores.tipoProducto');
      this.toastr.success(this.translate.instant('alertas.toastr.exportar.seleccionado.success'));
    } else {
      const filtros = {
        pageNumber: 0,
        pageSize: 2000,
        sortField: sortField,
        sortDirection: sortDirection,
        ...optionalFilter
      };

      this.tipoProductoService.buscarFiltradoAsignacion(filtros).subscribe(
        (response: any) => {
          const apiData = response?.content ?? response?.data ?? [];
          if (apiData.length === 0) {
            this.toastr.error("No hay datos disponibles para exportar.");
            return;
          }

          handleExport(apiData, 'mantenedores.tipoProducto');
          this.toastr.success(this.translate.instant('alertas.toastr.exportar.todo.success'));
        },
        (error) => {
          console.error("Error en la solicitud a la API:", error);
          this.toastr.error("Ha ocurrido un error al obtener los datos para exportar.");
        }
      );
    }
  }

  volver() {
    this.router.navigate(['/portal/home']);
  }

  sortDatos(sortData: { selectedColumnName: string, currentSortType: string }) {
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'descripcionTipoProducto': 'descripcionTipoProducto',
      'fechaCreacion': 'fechaCreacion',
      'fechaModificacion': 'fechaModificacion',
      'estado': 'estado',
      'usuarioCreacion': 'usuarioCreacion',
      'usuarioModificacion': 'usuarioModificacion'
    };

    const sortField = fieldMapping[sortData.selectedColumnName] || sortData.selectedColumnName;
    const sortDirection = ['asc', 'desc'].includes(sortData.currentSortType)
      ? sortData.currentSortType
      : 'asc';

    this.obtenerDatos(sortField, sortDirection);
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
    const sortField = this.currentSortState?.column || 'id';
    const sortDirection = this.currentSortState?.direction || 'asc';

    this.obtenerDatos(sortField, sortDirection, this.currentFilters);
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



  obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
    this.isLoading = true;

    const params = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      sortField: sortField,
      sortDirection: sortDirection.toUpperCase(),
      ...optionalFilter
    };

    console.log('Parámetros de búsqueda:', params);

    this.tipoProductoService.buscarFiltradoAsignacion(params).subscribe({
      next: (response: any) => {
        if (response?.content) {
          this.dataSource = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.pageNumber = response.pageNumber;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(selectedItems: TipoProducto[]) {
    if (!selectedItems?.length) {
      return;
    }

    const ids = selectedItems
      .map(item => item.id)
      .filter((id): id is number => id !== undefined);

    if (ids.length === 0) {
      return;
    }

    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.tipoProducto.titulo');
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
        this.tipoProductoService.borrarTodos(ids).subscribe({
          next: () => {
            this.sharedTableComponent.clearSelection();

            const remainingItemsInPage = this.dataSource.length - ids.length;
            if (remainingItemsInPage <= 0 && this.pageNumber > 0) {
              this.pageNumber--;
            }

            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
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
    const tipoProducto = this.dataSource.find(item => item.id === Number(id));
    const tipoProductoId = tipoProducto?.id;
    if (typeof tipoProductoId !== 'number') {
      return;
    }

    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.tipoProducto.titulo');
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
        const tipoProductoTipoComponentes = tipoProducto?.tipoProductoTipoComponentes || [];

        if (tipoProductoTipoComponentes.length === 0) {
          this.tipoProductoService.borrar(tipoProductoId).subscribe({
            next: () => {
              this.sharedTableComponent.clearSelection();
              this.obtenerDatos();
              this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
            },
            error: (error: unknown) => {
              console.error("Error al eliminar tipo producto:", error);
              this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
            }
          });
          return;
        }

        const deleteRelaciones$ = tipoProductoTipoComponentes
          .filter(relacion => relacion.tipoComponente?.id !== undefined)
          .map(relacion =>
            this.tipoProductoTipoComponenteService.borrar(tipoProductoId, relacion.tipoComponente.id!)
          );

        forkJoin(deleteRelaciones$)
          .pipe(
            switchMap(() => this.tipoProductoService.borrar(tipoProductoId)),
            catchError((error: unknown) => {
              console.error("Error al eliminar elementos:", error);
              this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
              return throwError(() => error);
            })
          )
          .subscribe({
            next: () => {
              this.sharedTableComponent.clearSelection();
              this.obtenerDatos();
              this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
            },
            error: (error: unknown) => {
              console.error("Error al eliminar elementos:", error);
              this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
            }
          });
      }
    });
  }

  onDeleteTipoComponente(tipoProducto: TipoProducto, tipoComponente: TipoProductoTipoComponente) {
    const tipoProductoId = tipoProducto?.id;
    if (typeof tipoProductoId !== 'number') {
      return;
    }

    const tipoComponenteId = tipoComponente?.tipoComponente?.id;
    if (typeof tipoComponenteId !== 'number') {
      return;
    }

    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.tipoProducto.titulo');
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
        this.tipoProductoTipoComponenteService.borrar(tipoProductoId, tipoComponenteId).subscribe({
          next: () => {
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: err => {
            console.error("Error al eliminar elementos:", err);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
          }
        });
      }
    });
  }

  onClearTipoComponentes(tipoProducto: TipoProducto) {
    const tipoProductoId = tipoProducto?.id;
    if (typeof tipoProductoId !== 'number') {
      return;
    }

    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.tipoProducto.titulo');
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
        this.tipoProductoService.borrar(tipoProductoId).subscribe({
          next: () => {
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: err => {
            console.error("Error al eliminar elementos:", err);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
          }
        });
      }
    });
  }

  agregarServicio() {
    const dialogRef = this.dialog.open(TipoProductoFormComponent, {
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

  onEditSelected(id: string) {
    const selectedObject = this.dataSource.find(item => item.id === Number(id));
    if (!selectedObject) {
      return;
    }
    const dialogRef = this.dialog.open(TipoProductoFormComponent, {
      width: '450px',
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


  onAsignacion(element: any): void {
    const dialogRef = this.dialog.open(TipoProductoFormComponent, {
      width: '450px',
      data: {
        esActualizar: true,
        object: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerDatos();
      }
    });
  }



  onDeleteSelected(ids: string[]) {
    const selectedItems = this.dataSource.filter(item => ids.includes(item.id.toString()));
    this.eliminar(selectedItems);
  }

  onFilter(event: any) {
    this.buscar(event);
  }

  onDelete(event: any) {
    const id = event?.target?.value || event;
    this.onDeleteSingleSelected(id);
  }

  onEdit(event: any) {
    const id = event?.target?.value || event;
    this.onEditSelected(id);
  }

  onViewForm(element: any): void {
    const dialogRef = this.dialog.open(TipoProductoViewComponent, {
      width: '450px',
      data: {
        object: element.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerDatos();
      }
    });
  }
}