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
  @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
  @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
  @Input() tableData: any[] = [];

  selectedFilter: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData']) {
      console.log('tableData recibida:', this.tableData);
    }

    if (changes['tableData'] && this.tableData && this.tableData.length > 0) {
      const zonesMap = new Map<number, string>();

      this.tableData.forEach(item => {
        if (item.zona && typeof item.zona === 'object') {
          const zoneId = item.zona.id;
          const zoneLabel = item.zona.descripcionZona || item.zona.nombre || 'Zona';
          zonesMap.set(zoneId, zoneLabel);
        }
      });

      const zoneOptions = Array.from(zonesMap.entries()).map(([id, label]) => ({
        label: label,
        value: JSON.stringify({ id, label })
      }));

      // Agregar opción "No seleccionar"
      this.filterOptions = [{ label: 'No seleccionado', value: '' }, ...zoneOptions];

      console.log('filterOptions actualizadas:', this.filterOptions);
    }
  }

  onValueChange() {
    if (this.isSimpleSearch) return;
    this.valueChange.emit({ field: this.field, value: this.value });
  }

  executeSearch() {
    if (this.selectedFilter && this.selectedFilter !== '') {
      const selectedZone = JSON.parse(this.selectedFilter);
      console.log('Emitiendo filterSearch:', { filter: selectedZone.id, value: selectedZone.id });
      this.filterSearch.emit({ filter: selectedZone.id, value: selectedZone.id });
    } else {
      console.log('Emitiendo simpleSearch:', { [this.field]: this.value });
      this.simpleSearch.emit({ [this.field]: this.value });
    }
  }

  shouldShowSearch(): boolean {
    return this.filterOptions.length > 0;
  }

  constructor(private translate: TranslateService) { }
}
