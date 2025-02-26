import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableData, TableDataService } from "../../../core/services/table-data.service";
import { SharedTableComponent } from "../../../shared/components/shared-table/shared-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ClasificacionClienteFormComponent } from "../../../shared/components/forms/clasificacion-cliente.component";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { ClasificacionClienteService } from "../../../core/services/clasificacion-cliente.service";
import { ClasificacionCliente } from "../../../core/models/clasificacion-cliente.model";
import { catchError, forkJoin, tap, throwError } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";


@Component({
  selector: "app-clasificacion-cliente",
  standalone: true,
  imports: [CommonModule, SharedTableComponent, MatIconModule, MatPaginatorModule, OpcionesMantenedorComponent],
  templateUrl: "./clasificacion-cliente.component.html",
  styleUrl: "./clasificacion-cliente.component.css",
})
export class ClasificacionClienteComponent implements OnInit {
  displayedColumns: string[] = []; // Se inicializa vacío
  dataSource: ClasificacionCliente[] = []; // Ahora usa la interfaz Clasificacion Cliente
  titulo: string = 'Clasificación de Clientes'; // Puedes cambiarlo dinámicamente
  hasSelection = false;
  selectedData: any[] = []; // Almacena la data seleccionada
  pageNumber = 0
  totalPages = 0
  pageSize = 5;
  totalElements = 0;

  constructor(private cdr: ChangeDetectorRef,
    private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
    private clasificacionClienteService: ClasificacionClienteService) { }

  ngOnInit() {
    this.obtenerDatos();

  }
  onSelectionChange(selectedItems: any[]) {
    this.hasSelection = selectedItems.length > 0;
    this.selectedData = selectedItems; // Guardamos la data seleccionada
  }


  onDeleteSelected(ids: string[]) {
    console.log("Eliminar seleccionados:", ids);
  }

  onViewSelected(id: string): void {
    const dialogRef = this.dialog.open(ClasificacionClienteFormComponent, {
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

  onEditSelected(id: string) {
    const selectedObject = this.dataSource.find(item => item.id === Number(id));
    console.log('Selected Object:', selectedObject);

    if (!selectedObject) {
      console.error("No se encontró el objeto a editar.");
      return;
    }

    const dialogRef = this.dialog.open(ClasificacionClienteFormComponent, {
      width: '400px',
      data: {
        esActualizar: true,
        object: selectedObject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Datos editados recibidos:", result);

        if (!result.clasificacionClienteDesc) {
          console.error("Descripción no válida:", result.clasificacionClienteDesc);
          return;
        }

        const formData: ClasificacionCliente = {
          id: result.id,
          clasificacionClienteDesc: result.clasificacionClienteDesc
        };

        this.clasificacionClienteService.actualizar(formData.id, formData).pipe(
          tap(response => {
            console.log("Respuesta del servicio:", response);
            this.obtenerDatos();
          }),
          catchError(error => {
            console.error("Error en el servicio:", error);
            return throwError(error);
          })
        ).subscribe();
      }
    });
  }

  agregarServicio() {
    const dialogRef = this.dialog.open(ClasificacionClienteFormComponent, {
      width: '400px',
      data: {
        esActualizar: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Datos recibidos del formulario:", result);
        this.clasificacionClienteService.crear(result).subscribe(
          (response) => {
            console.log("Cliente creado con éxito:", response);
          },
          (error) => {
            console.error("Error al crear cliente:", error);
          }
        );
      }
    });
  }



  exportarExcel(selectedItems: TableData[]) {
    console.log("Exportando los siguientes elementos:", selectedItems);
    this.exportService.exportToExcel(selectedItems, this.titulo);
  }

  eliminarServicio(selectedItems: ClasificacionCliente[]) {
    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      width: '600px',
      height: '400px',
      data: {
        titulo: 'Eliminación individual',
        mensaje: `¿Estás seguro que deseas eliminar ${selectedItems.length > 1 ? 'los elementos seleccionados' : 'el elemento'}? Esta acción no se puede deshacer`,
        textoBotonCancelar: 'Cancelar',
        textoBotonConfirmar: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const ids = selectedItems.map(item => item.id);
        console.log("Datos a enviar para eliminar:", { ids: ids });

        this.clasificacionClienteService.borrarTodos(ids).subscribe({
          next: () => {
            console.log("Elementos eliminados exitosamente:", ids);
            this.dataSource = this.dataSource.filter(item => !ids.includes(item.id));
            this.hasSelection = false;
          },
          error: err => {
            console.error("Error al eliminar elementos:", err);
          }
        });
      }
    });
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

  }

  obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc') {
    this.clasificacionClienteService.buscarFiltrado({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: sortField,
      sortDirection: sortDirection
    }).subscribe((data: PagedResponse<ClasificacionCliente[]>) => {
      console.log("Datos recibidos:", data);

      this.pageNumber = data.pageNumber
      this.totalPages = data.totalPages
      this.pageSize = data.pageSize;
      this.totalElements = data.totalElements;

      this.dataSource = data.content.flat();
      if (data.content.length > 0) {
        this.displayedColumns = Object.keys(data.content[0]);
      }
      this.cdr.detectChanges();
    });
  }

  transformarNombreColumna(columna: string): string {
    return columna
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

}

