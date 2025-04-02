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
  @Input() showDiv: boolean = true;
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
  selectedItems: any[] = [];
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

  ngOnInit() {
    this.updateSelection();
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


  get allColumns(): string[] {
    return ['select', ...this.sortColumns, 'actions'];
  }


  get sortColumns(): string[] {
    return [...this.displayedColumns.filter(col => col !== 'id')];
  }

  // Lógica para verificar si todas las filas están seleccionadas
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }


  protected onSort(selectedColumnName: string, columnIndex: number) {

    this.sortHeaders.forEach((header, i) => {
      const element = header.nativeElement;
      //console.log("###")
      //console.log("selectedColumnName", selectedColumnName)
      //console.log("columnIndex", columnIndex)
      //console.log("header", header)
      //console.log("element", element)
      //console.log("i", i)
      //console.log("###")
      if (i === columnIndex) {
        console.log("Pasé este if")
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
        console.log("no sort type")
        element.setAttribute('sortType', '');
      }
    });
    this.currentSortIndex = columnIndex;
    this.cdr.detectChanges();

    this.sort.emit({ selectedColumnName, currentSortType: this.currentSortType });
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
    this.updateSelection();

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



  private updateSelection() {
    this.selection.clear();
    // Sincronizar la selección con los elementos de selectedItems
    this.dataSource.forEach(row => {
      if (this.selectedItems.some(item => item.id === row.id)) {
        this.selection.select(row);
      }
    });
    this.cdr.detectChanges();
  }



  // Método para seleccionar o deseleccionar una fila
  onRowSelection(row: any) {
    if (this.selection.isSelected(row)) {
      // Desmarcar la fila
      this.selection.deselect(row);
      this.selectedItems = this.selectedItems.filter(item => item.id !== row.id);
    } else {
      // Marcar la fila
      this.selection.select(row);
      this.selectedItems.push(row);
    }
    this.notifySelectionChange();
  }

  // Verifica si un checkbox debe estar marcado
  isChecked(row: any): boolean {
    return this.selectedItems.some(item => item.id === row.id);
  }

  // Notifica los cambios de selección
  notifySelectionChange() {
    this.selectionChange.emit(this.selectedItems);
  }



  protected onPageChanged(newPage: number) {
    console.log("Cambiando a la página:", newPage);
    this.pageChanged.emit(newPage);

    // Mantener la selección global
    this.updateSelection();
  }



  get endItem(): number {
    return Math.min((this.pageNumber + 1) * this.pageSize, this.totalElements);
  }


  // Método para limpiar toda la selección
  clearSelection() {
    this.selection.clear();
    this.selectedItems = [];
    this.notifySelectionChange();
  }


  // Seleccionar o deseleccionar todas las filas
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedItems = [];  // Limpiar selectedItems cuando se deseleccionan todas
    } else {
      this.selection.select(...this.dataSource);
      // Agregar los elementos seleccionados a selectedItems globalmente sin duplicados
      this.selectedItems = [
        ...new Map(
          [...this.selectedItems, ...this.dataSource].map(item => [item.id, item])
        ).values()
      ];
    }
    this.notifySelectionChange(); // Notificar cambios en la selección
  }


}