import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BusquedaComponent } from '../../../../shared/components/busqueda/busqueda.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-busqueda-sector',
  standalone: true,
  imports: [BusquedaComponent, TranslateModule, CommonModule],
  templateUrl: './busqueda-sector.component.html',
  styleUrl: './busqueda-sector.component.css'
})
export class BusquedaSectorComponent {

  @Input() filters: any[] = [];
  @Input() filtersLabels: any[] = [];
  @Input() simpleSearchField: string = '';
  @Input() dataSource: any[] = [];
  @Input() showDiv: boolean = true;
  @Input() translationGroup = ""

  @Output() applyfilter = new EventEmitter<any>();
  @Output() filterDelete = new EventEmitter<string>();

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
    return this.translationGroup ? `${this.translationGroup}.${column}` : column
  }

}
