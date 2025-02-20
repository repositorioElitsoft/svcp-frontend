import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-shared-table",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: "./shared-table.component.html",
  styleUrls: ["./shared-table.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimización
})
export class SharedTableComponent {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() viewSelected = new EventEmitter<string>();
  @Output() editSelected = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>(); // Nuevo Output para notificar cambios en la selección

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Paginador como input

  selection = new SelectionModel<any>(true, []);
  pageSize = 5;  // Tamaño por defecto para la paginación

  dataSourceSubject = new BehaviorSubject<any[]>([]);

  // Getter dinámico para evitar problemas con @Input()
  get allColumns(): string[] {
    return ['select', ...this.displayedColumns, 'actions'];
  }

  // Lógica para verificar si todas las filas están seleccionadas
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  // Seleccionar o deseleccionar todas las filas
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource);
    }
    this.notifySelectionChange(); // Notificar cambios en la selección
  }

  // Etiqueta para el checkbox de la fila
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1}`;
  }


  // Emitir id de la fila seleccionada para ver
  onView(id: string) {
    this.viewSelected.emit(id);
  }


  // Emitir id de la fila seleccionada para editar
  onEdit(id: string) {
    this.editSelected.emit(id);
  }

  // Manejar cambios de página
  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSourceSubject.next(this.dataSource.slice(startIndex, endIndex));
  }

  // Actualizar el dataSource con paginación
  ngOnChanges() {
    this.dataSourceSubject.next(this.dataSource.slice(0, this.pageSize));  // Mostrar solo las primeras filas
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.onPageChange(this.paginator.page));
  }

  // Método para notificar cambios en la selección
  private notifySelectionChange() {
    // Emitir los datos seleccionados como un array
    this.selectionChange.emit(this.selection.selected);
  }

  // Método para manejar la selección/deselección de una fila individual
  onRowSelection(row: any) {
    // Alterna la selección de la fila (la selecciona si no está seleccionada, y la deselecciona si lo está)
    this.selection.toggle(row);

    // Notificar los cambios en la selección, incluyendo los datos seleccionados
    this.notifySelectionChange();
  }



}