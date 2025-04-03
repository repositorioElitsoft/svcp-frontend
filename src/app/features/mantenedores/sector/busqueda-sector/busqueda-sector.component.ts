import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ZonaService } from '../../../../core/services/zona.service';
import { Zona } from '../../../../core/models/zona.model';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';

@Component({
  selector: 'app-busqueda-sector',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './busqueda-sector.component.html',
  styleUrls: ['./busqueda-sector.component.css']
})
export class BusquedaSectorComponent implements OnInit {
  @Input() field: string = '';
  @Input() value: string = '';
  @Input() filterOptions: any = [];
  @Input() isSimpleSearch: boolean = false;
  @Input() tableData: any[] = [];
  @Input() filters: any[] = [];
  @Input() filtersLabels: any[] = [];
  @Input() simpleSearchField: string = '';
  @Input() dataSource: any[] = [];
  @Input() showDiv: boolean = true;
  @Input() translationGroup = "";


  @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
  @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
  @Output() applyfilter = new EventEmitter<any>();
  @Output() filterDelete = new EventEmitter<string>();

  selectedFilter: any = {};

  constructor(
    private translate: TranslateService,
    private zonaService: ZonaService
  ) { }

  ngOnInit() {
    this.cargarZonas();
  }

  private cargarZonas() {
    this.zonaService.buscarTodos().subscribe({
      next: (response: ApiEntityResponse<Zona[]>) => {
        if (response && response.data) {
          this.filterOptions = response.data;
          // Agregar opción "Todos" al inicio utilizando la traducción
          this.filterOptions.unshift({ id: null, descripcionZona: this.translate.instant('mantenedores.seleccion') });
          // Seleccionar la opción "Todos" por defecto
          this.selectedFilter = this.filterOptions[0];
        }
      },
      error: (error) => {
        console.error('Error al cargar las zonas:', error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData']) {
      console.log('tableData recibida:', this.tableData);
    }
  }

  onValueChange() {
    console.log('onValueChange llamado, value:', this.value);
    if (this.isSimpleSearch) return;
  }

  executeSearch() {
    console.log('executeSearch llamado');
    console.log('selectedFilter:', this.selectedFilter);
    console.log('value:', this.value);

    const filter: any = {};
    const labels: any[] = [];

    // Si hay un valor en el input de búsqueda
    if (this.value) {
      filter.descripcionSector = this.value;
      labels.push({ field: 'descripcionSector', value: this.value });
    }

    // Si hay una zona seleccionada y no es la opción "Todos"
    if (this.selectedFilter && this.selectedFilter.id !== null) {
      filter.zona = this.selectedFilter?.id;
      labels.push({ field: 'zona', value: this.selectedFilter.descripcionZona, id: this.selectedFilter.id });
    }

    // Siempre emitimos el filtro, incluso si está vacío
    console.log('Emitiendo filtro:', { filter, labels });
    this.applyfilter.emit({ filter, labels });
  }

  shouldShowSearch(): boolean {
    return true;
  }

  isKeyMissing(filter: any, key: string): boolean {
    return !Object.prototype.hasOwnProperty.call(filter, key);
  }

  makeSimpleSearch(values: any) {
    console.log('simple search activated ', values);
    this.applyfilter.emit(values);
  }

  deleteFilter(field: string) {
    this.filterDelete.emit(field);
  }

  filter() {
    console.log('Applying filters', this.filters);
    this.applyfilter.emit(this.filters);
  }

  protected getTranslationGroup(column: string) {
    return this.translationGroup ? `${this.translationGroup}.${column}` : column;
  }

  clearValue() {
    this.value = '';
    this.executeSearch();
  }

  clearZona() {
    this.selectedFilter = this.filterOptions[0];
    this.executeSearch();
  }


}
