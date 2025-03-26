import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  selectedFilter: string = '';

  ngOnChanges() {
    console.log('field:', this.field);
    console.log('value:', this.value);
    console.log('filterOptions:', this.filterOptions);
    console.log('isSimpleSearch:', this.isSimpleSearch);
  }

  onValueChange() {
    if (this.isSimpleSearch) return;
    this.valueChange.emit({ field: this.field, value: this.value });
  }

  executeSearch() {
    if (this.selectedFilter) {
      this.filterSearch.emit({ filter: this.selectedFilter, value: this.value });
    } else {
      this.simpleSearch.emit({ [this.field]: this.value });
    }
  }

  shouldShowSearch(): boolean {
    // Implementa la lógica de validación aquí
    return true; // Cambia esto con la condición real
  }

  shouldShowFilter(): boolean {
    return this.filterOptions.length > 0;
  }

  constructor(private translate: TranslateService) { }
}
