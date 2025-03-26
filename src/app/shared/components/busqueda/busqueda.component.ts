import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';  // Agregado
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
    CommonModule,  // Agregado
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
    // Verifica si las propiedades Input están recibiendo datos
    console.log('field:', this.field);
    console.log('value:', this.value);
    console.log('filterOptions:', this.filterOptions);
    console.log('isSimpleSearch:', this.isSimpleSearch);
  }

  onValueChange() {
    console.log('onValueChange triggered');
    if (this.isSimpleSearch) return;
    console.log('Emitting valueChange:', { field: this.field, value: this.value });
    this.valueChange.emit({ field: this.field, value: this.value });
  }

  executeSearch() {
    console.log('executeSearch triggered');
    if (this.selectedFilter) {
      console.log('Emitting filterSearch:', { filter: this.selectedFilter, value: this.value });
      this.filterSearch.emit({ filter: this.selectedFilter, value: this.value });
    } else {
      console.log('Emitting simpleSearch:', { [this.field]: this.value });
      this.simpleSearch.emit({ [this.field]: this.value });
    }
  }

  constructor(private translate: TranslateService) { }
}
