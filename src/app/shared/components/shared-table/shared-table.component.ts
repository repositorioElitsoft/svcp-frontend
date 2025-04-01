import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit, TemplateRef } from "@angular/core";
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
  @Input() pageSize = 10;  // Tamaño por defecto para la paginación
  @Input() translationGroup = ""
  @Input() filters: any[] = []
  @Input() filtersLabels: any[] = []
  @Input() simpleSearchField: string = "";
  @Input() filterSearch: string = "";
  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() deleteSingleSelected = new EventEmitter<string>();
  @Input() additionalActionsTemplate!: TemplateRef<any>; // Nuevo input para recibir el template de acciones adicionales
  @Output() viewSelected = new EventEmitter<string>();
  @Output() editSelected = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>(); // Nuevo Output para notificar cambios en la selección
  @Output() sort = new EventEmitter<{ selectedColumnName: string, currentSortType: string }>();
  @Output() applyfilter = new EventEmitter<any>();
  @Output() buscar = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() filterDelete = new EventEmitter<string>();

  @ViewChildren('filterInput') filterInputs!: QueryList<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Paginador como input
  @ViewChildren('sortHeader') sortHeaders!: QueryList<ElementRef>
  @Output() dataEmitted = new EventEmitter<any[]>();

  selection = new SelectionModel<any>(true, []);

  emptyMessage: string = "No hay datos disponibles.";
  dataSourceSubject = new BehaviorSubject<any[]>([]);

  currentSortType = '';
  currentSortIndex = -1;
  show = true

  constructor(private cdr: ChangeDetectorRef) { }

  isKeyMissing(filter: any, key: string): boolean {
    return !Object.prototype.hasOwnProperty.call(filter, key);
  }

  deleteFilter(field: string) {
    this.filterDelete.emit(field);
  }


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

  protected makeSimpleSearch(values: any) {
    console.log("simple search activated ", values)
    return this.applyfilter.emit(values);
  }


  protected filter() {
    const search = this.filterInputs.map(filter => ({
      field: filter.field,
      value: filter.value,
    }));
    console.log('Collected Filters:', search);

    const transformed = search.reduce((acc, { field, value }) => {
      if (value) {
        acc[field] = value;
      }
      return acc;
    }, {} as Record<string, string>);


    this.applyfilter.emit(transformed);
  }


  // Getter dinámico para evitar problemas con @Input()
  get allColumns(): string[] {
    // Filtramos la columna 'id' para que no se muestre en la tabla
    const filteredColumns = this.displayedColumns.filter(column => column !== 'id');
    return ['select', ...filteredColumns, 'actions'];
  }


  // Lógica para verificar si todas las filas están seleccionadas
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  protected onPageChanged(newPage: number) {
    console.log("Cambiando a la página:", newPage);
    this.selection.clear();
    console.log("Selección limpiada.");

    this.notifySelectionChange(); // Asegura que OpcionesMantenedorComponent se actualiza
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

  onSingleDelete(id: string) {
    this.deleteSingleSelected.emit(id);
  }


  // Actualizar el dataSource con paginación
  ngOnChanges() {
    const dataSlice = this.dataSource.slice(0, this.pageSize); // Obtener solo la parte paginada
    this.dataSourceSubject.next(dataSlice);
    this.dataEmitted.emit(dataSlice); // Emitir la data actualizada
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

  get endItem(): number {
    return Math.min((this.pageNumber + 1) * this.pageSize, this.totalElements);
  }


  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.pageNumber;
    const maxVisible = 4; // máximo botones visibles (incluye 1ª y última)

    // Si total es menor o igual que el máximo, se muestran todas las páginas
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const pages: number[] = [];
    const firstPage = 0;
    const lastPage = total - 1;

    // Siempre se muestra la primera página
    pages.push(firstPage);

    // Calcular el rango central: queremos mostrar 3 elementos (previo, actual, siguiente)
    // pero si estamos cerca de los extremos, se extiende el rango para llenar el máximo visible
    let start = current - 1;
    let end = current + 1;

    // Si el current está muy al principio, forzamos un rango inicial
    if (current <= 2) {
      start = 1;
      end = 3;
    }
    // Si el current está muy al final, ajustamos el rango para las últimas páginas
    else if (current >= total - 3) {
      start = total - 4;
      end = total - 2;
    }

    // Si hay un salto entre la primera página y el inicio del rango, insertamos el ellipsis
    if (start > firstPage + 1) {
      pages.push(-1);
    }

    // Insertamos el rango central
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Si hay un salto entre el final del rango y la última página, insertamos el ellipsis
    if (end < lastPage - 1) {
      pages.push(-1);
    }

    // Se muestra siempre la última página
    pages.push(lastPage);

    return pages;
  }




}