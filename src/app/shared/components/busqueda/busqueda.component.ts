import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-busqueda',
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
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent {
  @Input() field: string = '';
  @Input() value: string = '';
  @Input() filterOptions: { label: string; value: string }[] = [];
  @Input() isSimpleSearch: boolean = false;
  @Output() valueChange = new EventEmitter<{ field: string; value: string }>();
  @Output() simpleSearch = new EventEmitter<{ filter: any, labels: any[] }>();
  @Output() filterSearch = new EventEmitter<{ filter: any, labels: any[] }>();
  @Input() tableData: any[] = [];

  selectedFilter: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData']) {
      console.log('tableData recibida:', this.tableData);
    }

    if (changes['tableData'] && this.tableData && this.tableData.length > 0) {
      const zonesMap = new Map<number, string>();

      // Recorremos tableData para encontrar las zonas
      this.tableData.forEach(item => {
        if (item.zona && typeof item.zona === 'object') {
          const zoneId = item.zona.id;
          const zoneLabel = item.zona.descripcionZona || item.zona.nombre || 'Zona';
          zonesMap.set(zoneId, zoneLabel);
        }
      });

      // Si hay zonas, generamos las opciones
      if (zonesMap.size > 0) {
        const zoneOptions = Array.from(zonesMap.entries()).map(([id, label]) => ({
          label: label,
          value: JSON.stringify({ id, label })
        }));

        // Agregar opción "No seleccionado"
        this.filterOptions = [{ label: 'No seleccionado', value: '' }, ...zoneOptions];
        console.log('filterOptions actualizadas:', this.filterOptions);
      } else {
        // Si no hay zonas, se vacían las opciones
        this.filterOptions = [];
      }
    }
  }

  onValueChange() {
    if (this.isSimpleSearch) return;
    this.valueChange.emit({ field: this.field, value: this.value });
  }

  executeSearch() {
    const labels: any[] = [];
    const filter: any = {};

    if (this.selectedFilter && this.selectedFilter !== '') {
      const selectedZone = JSON.parse(this.selectedFilter);
      filter.zonaId = selectedZone.id;
      labels.push({ field: 'Zona', value: selectedZone.label });
      console.log('Emitiendo filterSearch:', { filter, labels });
      this.filterSearch.emit({ filter, labels });
    } else if (this.value) {
      filter[this.field] = this.value;
      labels.push({ field: this.field, value: this.value });
      console.log('Emitiendo simpleSearch:', { filter, labels });
      this.simpleSearch.emit({ filter, labels });
    } else {
      // Si no hay filtros, emitimos un objeto vacío
      console.log('Emitiendo sin filtros');
      this.simpleSearch.emit({ filter: {}, labels: [] });
    }
  }

  shouldShowSearch(): boolean {
    return this.filterOptions.length > 0;
  }

  constructor(private translate: TranslateService) { }
}
