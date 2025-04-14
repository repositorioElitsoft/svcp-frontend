import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
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
import { catchError, tap, throwError, forkJoin, map, of, switchMap } from "rxjs";
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
  displayedColumns: string[] = ['id', 'descripcionTrabajo', 'trabajoTareas'];
  columnConfig: {
    field: string;
    type: 'text' | 'chips' | 'custom';
    nestedPath?: string;
    displayField?: string;
    customTemplate?: TemplateRef<any>;
    sortable?: boolean;
  }[] = [
      { field: 'id', type: 'text' },
      { field: 'descripcionTrabajo', type: 'text' },
      {
        field: 'trabajoTareas',
        type: 'chips',
        nestedPath: 'tarea.descripcionTarea',
        sortable: false
      }
    ];
  dataSource: Trabajo[] = [];
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

      // Formatear los datos antes de la exportación
      const formattedData = dataArray.map(item => {
        const formattedItem: any = {
          id: item.id,
          descripcionTrabajo: item.descripcionTrabajo,
          tareas: item.trabajoTareas ? item.trabajoTareas
            .sort((a: any, b: any) => a.ordenEjecucionTarea - b.ordenEjecucionTarea)
            .map((tt: any) => tt.tarea.descripcionTarea)
            .join(', ') : ''
        };
        return formattedItem;
      });

      // Definir las columnas que queremos exportar y su orden
      const columnKeys = ['descripcionTrabajo', 'tareas'];

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
    // Mapear los nombres de las columnas a los campos del modelo
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'descripcionTrabajo': 'descripcionTrabajo',

    };

    // Obtener el campo de ordenamiento mapeado o usar el nombre de la columna original si no existe mapeo
    const sortField = fieldMapping[sortData.selectedColumnName] || sortData.selectedColumnName;

    // Validar la dirección de ordenamiento
    const sortDirection = ['asc', 'desc'].includes(sortData.currentSortType)
      ? sortData.currentSortType
      : 'asc';

    console.log('Ordenando por:', sortField, 'en dirección:', sortDirection);

    // Llamar a obtenerDatos con los parámetros validados
    this.obtenerDatos(sortField, sortDirection);
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

    // Primera llamada para obtener todos los trabajos y contar el total real
    this.trabajoService.buscarFiltrado(params).subscribe((fullResponse: any) => {
      console.log('Respuesta completa inicial:', fullResponse);

      // Obtenemos todos los trabajos únicos
      const todosLosTrabajos = new Map();
      if (Array.isArray(fullResponse?.content)) {
        fullResponse.content.forEach((item: any) => {
          if (!todosLosTrabajos.has(item.id)) {
            todosLosTrabajos.set(item.id, {
              id: item.id,
              descripcionTrabajo: item.descripcionTrabajo,
              trabajoTareas: Array.isArray(item.trabajoTareas) ? [...item.trabajoTareas] : []
            });
          }
        });
      }

      // Calculamos el total real de elementos y páginas
      this.totalElements = todosLosTrabajos.size;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);

      console.log('Total real de trabajos:', this.totalElements);
      console.log('Total de páginas:', this.totalPages);

      // Convertimos el Map a array y aplicamos ordenamiento
      let trabajosArray = Array.from(todosLosTrabajos.values());

      // Ordenamos el array según el campo y dirección especificados
      trabajosArray.sort((a: any, b: any) => {
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
      this.dataSource = trabajosArray.slice(inicio, fin);

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
  eliminar(selectedItems: Trabajo[]) {
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
    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
    const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
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

        this.trabajoService.borrarLote(ids).subscribe({
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

    const trabajo = this.dataSource.find(item => item.id === Number(id));
    console.log('Método onDeleteSingleSelected - Trabajo encontrado:', trabajo);

    const trabajoId = trabajo?.id;
    if (typeof trabajoId !== 'number') {
      console.log('Método onDeleteSingleSelected - ID no válido');
      return;
    }

    // Obtener las traducciones
    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
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

        // Primero obtenemos todas las tareas asociadas al trabajo
        const trabajoTareas = trabajo?.trabajoTareas || [];

        // Si no hay tareas, eliminamos directamente el trabajo
        if (trabajoTareas.length === 0) {
          console.log('Método onDeleteSingleSelected - No hay tareas, eliminando trabajo directamente');
          this.trabajoService.borrar(trabajoId).subscribe({
            next: () => {
              console.log('Método onDeleteSingleSelected - Eliminación exitosa');
              this.sharedTableComponent.clearSelection(); // Limpiamos la selección después de eliminar
              this.obtenerDatos();
              this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
            },
            error: (error: unknown) => {
              console.error("Error al eliminar trabajo:", error);
              this.toastr.error(this.translate.instant(convertErrorMessageToI18(error)));
            }
          });
          return;
        }

        // Si hay tareas, primero eliminamos todas las tareas
        console.log('Método onDeleteSingleSelected - Eliminando tareas asociadas');
        const deleteTrabajoTareas$ = trabajoTareas
          .filter(trabajoTarea => trabajoTarea.tarea?.id !== undefined)
          .map(trabajoTarea =>
            this.trabajoTareaService.borrar(trabajoId, trabajoTarea.tarea.id!)
          );

        // Ejecutamos la eliminación de tareas y luego el trabajo en secuencia
        forkJoin(deleteTrabajoTareas$)
          .pipe(
            // Después de eliminar todas las tareas, eliminamos el trabajo
            switchMap(() => this.trabajoService.borrar(trabajoId)),
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

  onDeleteTarea(trabajo: Trabajo, tarea: TrabajoTarea) {
    console.log('Método onDeleteTarea - Iniciando eliminación de tarea:', { trabajo, tarea });

    const trabajoId = trabajo?.id;
    if (typeof trabajoId !== 'number') {
      console.log('Método onDeleteTarea - ID de trabajo no válido');
      return;
    }

    const tareaId = tarea?.tarea?.id;
    if (typeof tareaId !== 'number') {
      console.log('Método onDeleteTarea - ID de tarea no válido');
      return;
    }

    // Obtener las traducciones
    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.trabajo.titulo');
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
          error: err => {
            console.error("Error al eliminar elementos:", err);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
          }
        });
      } else {
        console.log('Método onDeleteTarea - Usuario canceló la eliminación');
      }
    });
  }

  onClearTareas(trabajo: Trabajo) {
    console.log('Método onClearTareas - Iniciando limpieza de tareas para trabajo:', trabajo);

    const trabajoId = trabajo?.id;
    if (typeof trabajoId !== 'number') {
      console.log('Método onClearTareas - ID de trabajo no válido');
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

        this.trabajoService.borrar(trabajoId).subscribe({
          next: () => {
            console.log('Método onClearTareas - Eliminación exitosa');
            this.obtenerDatos();
            this.toastr.success(this.translate.instant('alertas.toastr.eliminar.success'));
          },
          error: err => {
            console.error("Error al eliminar elementos:", err);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(err)));
          }
        });
      } else {
        console.log('Método onClearTareas - Usuario canceló la eliminación');
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