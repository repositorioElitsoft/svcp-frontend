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
  @Input() filterOptions: { label: string; value: string }[] = [];
  @Input() isSimpleSearch: boolean = false;
  @Input() tableData: any[] = [];
  @Input() filters: any[] = [];
  @Input() filtersLabels: any[] = [];
  @Input() simpleSearchField: string = '';
  @Input() dataSource: any[] = [];
  @Input() showDiv: boolean = true;
  @Input() translationGroup = "";

  @Output() valueChange = new EventEmitter<{ field: string; value: string }>();
  @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
  @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
  @Output() applyfilter = new EventEmitter<any>();
  @Output() filterDelete = new EventEmitter<string>();

  selectedFilter: string = '';

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
          this.filterOptions = response.data.map((zona: Zona) => ({
            label: zona.descripcionZona || 'Zona',
            value: zona.id.toString()
          }));
          // Agregar opción "No seleccionado" al inicio
          this.filterOptions.unshift({ label: 'No seleccionado', value: '' });
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
    if (this.isSimpleSearch) return;
    this.valueChange.emit({ field: this.field, value: this.value });
  }

  executeSearch() {
    if (this.selectedFilter && this.selectedFilter !== '') {
      console.log('Emitiendo filterSearch:', { filter: this.selectedFilter, value: this.selectedFilter });
      this.filterSearch.emit({ filter: this.selectedFilter, value: this.selectedFilter });
    } else {
      console.log('Emitiendo simpleSearch:', { [this.field]: this.value });
      this.simpleSearch.emit({ [this.field]: this.value });
    }
  }

  shouldShowSearch(): boolean {
    return true; // Siempre mostramos el select ya que ahora cargamos las zonas del servicio
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
}
