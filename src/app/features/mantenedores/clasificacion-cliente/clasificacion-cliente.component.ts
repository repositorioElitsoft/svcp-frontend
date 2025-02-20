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


@Component({
  selector: "app-clasificacion-cliente",
  standalone: true,
  imports: [CommonModule, SharedTableComponent, MatIconModule, MatPaginatorModule, OpcionesMantenedorComponent],
  templateUrl: "./clasificacion-cliente.component.html",
  styleUrl: "./clasificacion-cliente.component.css",
})
export class ClasificacionClienteComponent implements OnInit {
  displayedColumns: string[] = ["name", "age", "email"];
  dataSource: TableData[] = []; // Ahora usa la interfaz TableData
  titulo: string = 'Clasificación de Clientes'; // Puedes cambiarlo dinámicamente
  hasSelection = false;
  selectedData: any[] = []; // Almacena la data seleccionada
  constructor(private tableDataService: TableDataService, private cdr: ChangeDetectorRef, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.tableDataService.getData().subscribe((data: TableData[]) => {
      this.dataSource = [...data];
      this.cdr.detectChanges();
    });
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
        object: this.dataSource.find(item => item.id === id)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Ver seleccionado:", result);
      }
    });
  }

  onEditSelected(id: string) {
    const dialogRef = this.dialog.open(ClasificacionClienteFormComponent, {
      width: '400px',
      data: {
        esActualizar: true,
        object: this.dataSource.find(item => item.id === id)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Editar seleccionado:", result);
      }
    });
  }


  agregarServicio() {
    console.log('Agregar servicio');
  }

  exportarExcel(selectedItems: TableData[]) {
    console.log("Exportando los siguientes elementos:", selectedItems);
    // Aquí podrías implementar la lógica de exportación (ej. convertir a CSV o Excel)
  }

  eliminarServicio(selectedItems: TableData[]) {
    console.log("Eliminando los siguientes elementos:", selectedItems);
    this.dataSource = this.dataSource.filter(item => !selectedItems.includes(item)); // Eliminar de la lista
    this.hasSelection = false;
  }

  volver() {
    this.router.navigate(['/portal/home']);
  }


}
