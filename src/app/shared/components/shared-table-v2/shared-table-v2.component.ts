import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { BusquedaComponent } from "../busqueda/busqueda.component";
import { SkeletonTableComponent } from "../skeleton-table/skeleton-table.component";
import { ChipsComponent } from "../chips/chips.component";

@Component({
  selector: "app-shared-table-v2",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatPaginatorModule,
    BusquedaComponent,
    SkeletonTableComponent,
    ChipsComponent
  ],
  templateUrl: "./shared-table-v2.component.html",
  styleUrls: ["./shared-table-v2.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableV2Component implements OnInit {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() totalElements: number = 0;
  @Input() pageNumber = 0;
  @Input() totalPages = 0;
  @Input() showDiv: boolean = true;
  @Input() pageSize = 10;
  @Input() translationGroup = "";
  @Input() filters: any[] = [];
  @Input() filtersLabels: any[] = [];
  @Input() simpleSearchField: string = "";
  @Input() filterSearch: string = "";
  @Input() additionalActionsTemplate!: TemplateRef<any>;

  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() deleteSingleSelected = new EventEmitter<string>();
  @Output() viewSelected = new EventEmitter<string>();
  @Output() editSelected = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() sort = new EventEmitter<{ selectedColumnName: string, currentSortType: string }>();
  @Output() applyfilter = new EventEmitter<any>();
  @Output() buscar = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() filterDelete = new EventEmitter<{ field: string, value: string }>();
  @Output() dataEmitted = new EventEmitter<any[]>();
  @Output() chipDelete = new EventEmitter<{ parent: any, item: any }>();
  @Output() chipsClear = new EventEmitter<any>();
  @Output() asignacion = new EventEmitter<any>();
  @Output() showMore = new EventEmitter<any>();

  @ViewChildren('filterInput') filterInputs!: QueryList<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('sortHeader') sortHeaders!: QueryList<ElementRef>;

  selection = new SelectionModel<any>(true, []);
  selectedItems: any[] = [];
  emptyMessage: string = "No hay datos disponibles.";
  dataSourceSubject = new BehaviorSubject<any[]>([]);
  currentSortType = '';
  currentSortIndex = -1;
  show = true;
  isDesktop = window.innerWidth >= 640;

  constructor(private cdr: ChangeDetectorRef) {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth >= 640;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.updateSelection();
  }

  isKeyMissing(filter: any, key: string): boolean {
    return !Object.prototype.hasOwnProperty.call(filter, key);
  }

  deleteFilter(field: string) {
    this.filterDelete.emit({ field, value: '' });
  }

  getField(value: any) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    // Si es un array (como trabajoTareas), devolver vacío ya que se maneja con chips
    if (Array.isArray(value)) {
      return '';
    }

    // Para objetos, buscar campos descriptivos en orden de prioridad
    const descriptiveFields = ['descripcionTrabajo', 'descripcion', 'desc', 'nombre'];
    for (const field of descriptiveFields) {
      if (Object.prototype.hasOwnProperty.call(value, field)) {
        return value[field];
      }
    }

    // Si no se encuentra ningún campo descriptivo, devolver el primer valor
    const firstKey = Object.keys(value)[0];
    return value[firstKey] || '';
  }

  protected getTranslationGroup(column: string) {
    return this.translationGroup ? `${this.translationGroup}.${column}` : column;
  }

  protected makeSimpleSearch(values: any) {
    if (values && values.labels) {
      this.filtersLabels = values.labels;
    }
    return this.applyfilter.emit(values);
  }

  protected filter() {
    const search = this.filterInputs.map(filter => ({
      field: filter.field,
      value: filter.value,
    }));

    const transformed = search.reduce((acc, { field, value }) => {
      if (value) {
        acc[field] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const labels = search
      .filter(({ value }) => value)
      .map(({ field, value }) => ({ field, value }));

    this.filtersLabels = labels;
    this.applyfilter.emit({ filter: transformed, labels });
  }

  get allColumns(): string[] {
    return ['select', ...this.sortColumns, 'actions'];
  }

  get sortColumns(): string[] {
    return [...this.displayedColumns.filter(col => col !== 'id')];
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  protected onSort(selectedColumnName: string, columnIndex: number) {
    this.sortHeaders.forEach((header, i) => {
      const element = header.nativeElement;
      if (i === columnIndex) {
        this.currentSortType = element.getAttribute('sortType') || '';
        if (this.currentSortType === 'asc') {
          this.currentSortType = "desc";
          element.setAttribute('sortType', 'desc');
        } else if (this.currentSortType === 'desc') {
          this.currentSortType = "asc";
          element.setAttribute('sortType', 'asc');
        } else {
          this.currentSortType = "asc";
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

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1}`;
  }

  onView(id: string) {
    this.viewSelected.emit(id);
  }

  onEdit(id: string) {
    this.editSelected.emit(id);
  }

  onSingleDelete(id: string) {
    this.deleteSingleSelected.emit(id);
  }

  ngOnChanges() {
    const dataSlice = this.dataSource.slice(0, this.pageSize);
    this.dataSourceSubject.next(dataSlice);
    this.dataEmitted.emit(dataSlice);
    this.updateSelection();
  }

  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.pageNumber;
    const maxVisible = 4;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const pages: number[] = [];
    const firstPage = 0;
    const lastPage = total - 1;

    pages.push(firstPage);

    let start = current - 1;
    let end = current + 1;

    if (current <= 2) {
      start = 1;
      end = 3;
    } else if (current >= total - 3) {
      start = total - 4;
      end = total - 2;
    }

    if (start > 1) {
      pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      if (i > 0 && i < lastPage) {
        pages.push(i);
      }
    }

    if (end < lastPage - 1) {
      pages.push(-1);
    }

    if (lastPage !== firstPage) {
      pages.push(lastPage);
    }

    return pages;
  }

  private updateSelection() {
    this.selection.clear();
    this.dataSource.forEach(row => {
      if (this.selectedItems.some(item => item.id === row.id)) {
        this.selection.select(row);
      }
    });
    this.cdr.detectChanges();
  }

  onRowSelection(row: any) {
    this.selection.toggle(row);
    const index = this.selectedItems.findIndex(item => item.id === row.id);

    if (index === -1 && this.selection.isSelected(row)) {
      this.selectedItems.push(row);
    } else if (index !== -1 && !this.selection.isSelected(row)) {
      this.selectedItems.splice(index, 1);
    }

    this.notifySelectionChange();
  }

  isChecked(row: any): boolean {
    return this.selection.isSelected(row);
  }

  notifySelectionChange() {
    this.selectionChange.emit(this.selectedItems);
  }

  protected onPageChanged(newPage: number) {
    this.pageChanged.emit(newPage);
  }

  get endItem(): number {
    return Math.min((this.pageNumber + 1) * this.pageSize, this.totalElements);
  }

  clearSelection() {
    this.selection.clear();
    this.selectedItems = [];
    this.notifySelectionChange();
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.clearSelection();
    } else {
      this.dataSource.forEach(row => {
        if (!this.selection.isSelected(row)) {
          this.selection.select(row);
          if (!this.selectedItems.some(item => item.id === row.id)) {
            this.selectedItems.push(row);
          }
        }
      });
      this.notifySelectionChange();
    }
  }

  onFilterDelete(field: string, filter: any) {
    this.filterDelete.emit({ field, value: filter?.id || filter?.value });
  }

  onChipDelete(parent: any, item: any) {
    this.chipDelete.emit({ parent, item });
  }

  onChipsClear(parent: any) {
    this.chipsClear.emit(parent);
  }

  onAsignacion(element: any): void {
    this.asignacion.emit(element);
  }

  onShowMore(element: any): void {
    this.showMore.emit(element);
  }
}
