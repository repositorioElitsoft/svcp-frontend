import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { BehaviorSubject, filter } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationEnd, Router } from "@angular/router";
import { BusquedaComponent } from "../busqueda/busqueda.component";

@Component({
  selector: "app-shared-table",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatButtonModule, MatIconModule, TranslateModule, MatPaginatorModule, BusquedaComponent],
  templateUrl: "./shared-table.component.html",
  styleUrls: ["./shared-table.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimización
})
export class SharedTableComponent {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() totalElements: number = 0;
  @Input() pageNumber = 0
  @Input() totalPages = 0
  @Input() pageSize = 5;  // Tamaño por defecto para la paginación
  @Input() translationGroup = ""
  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() viewSelected = new EventEmitter<string>();
  @Output() editSelected = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>(); // Nuevo Output para notificar cambios en la selección
  @Output() sort = new EventEmitter<{ selectedColumnName: string, currentSortType: string }>();
  @Output() buscar = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Paginador como input
  @ViewChildren('sortHeader') sortHeaders!: QueryList<ElementRef>

  selection = new SelectionModel<any>(true, []);

  emptyMessage: string = "No hay datos disponibles.";
  dataSourceSubject = new BehaviorSubject<any[]>([]);

  currentSortType = '';
  currentSortIndex = -1;
  show = true

  constructor(private cdr: ChangeDetectorRef) { }

  getField(value: any) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (key.toLowerCase().includes("desc")) {
          return value[key];
        }
      }
    }
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (key.toLowerCase().includes("nombre")) {
          return value[key];
        }
      }
    }
    return "";
  }

  protected getTranslationGroup(column: string) {
    return this.translationGroup ? `${this.translationGroup}.${column}` : column
  }

  protected buscarEvent(busqueda: string) {
    this.buscar.emit(busqueda);
  }


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

  protected onPageChanged(newPage: number) {
    this.pageChanged.emit(newPage);
  }


  protected onSort(selectedColumnName: string, columnIndex: number) {

    this.sortHeaders.forEach((header, i) => {
      const element = header.nativeElement;
      if (i === columnIndex) {
        this.currentSortType = element.getAttribute('sortType') || '';
        if (this.currentSortType === 'asc') {
          this.currentSortType = "desc"
          element.setAttribute('sortType', 'desc');
        } else if (this.currentSortType === 'desc') {
          this.currentSortType = "asc"
          element.setAttribute('sortType', 'asc');
        } else {
          this.currentSortType = "asc"
          element.setAttribute('sortType', 'asc');
        }
      } else {
        element.setAttribute('sortType', '');
      }
    });
    this.currentSortIndex = columnIndex;
    this.cdr.detectChanges();
    this.sort.emit({ selectedColumnName, currentSortType: this.currentSortType });
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


  // Actualizar el dataSource con paginación
  ngOnChanges() {
    this.dataSourceSubject.next(this.dataSource.slice(0, this.pageSize));  // Mostrar solo las primeras filas
  }



  // Método para notificar cambios en la selección
  notifySelectionChange() {
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