import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableData, TableDataService } from "../../../core/services/table-data.service";
import { SharedTableComponent } from "../../../shared/components/shared-table/shared-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";

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
  constructor(private tableDataService: TableDataService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.tableDataService.getData().subscribe((data: TableData[]) => {
      this.dataSource = [...data];
      this.cdr.detectChanges();
    });
  }

  onDeleteSelected(ids: string[]) {
    console.log("Eliminar seleccionados:", ids);
  }

  onViewSelected(id: string) {
    console.log("Ver seleccionado:", id);
  }

  onEditSelected(id: string) {
    console.log("Editar seleccionado:", id);
  }


  agregarServicio() {
    console.log('Agregar servicio');
  }

  exportarExcel() {
    console.log('Exportando Excel...');
  }

  eliminarServicio() {
    console.log('Eliminando servicio...');
  }

  volver() {
    this.router.navigate(['/portal/home']);
  }

}
