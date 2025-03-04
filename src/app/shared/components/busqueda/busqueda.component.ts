import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  @Input() field: string = '';
  @Input() value: string = '';
  @Input() isSimpleSearch: boolean = false
  @Output() valueChange = new EventEmitter<{ field: string; value: string }>();
  @Output() simpleSearch = new EventEmitter<{ [x: string]: string; }>();

  onValueChange() {
    if (this.isSimpleSearch) return
    this.valueChange.emit({ field: this.field, value: this.value });
  }
  makeSimpleSearch() {
    console.log('attempting to make simple search, is simple search?', this.isSimpleSearch);
    if (!this.isSimpleSearch) return;
    const newObject = { [this.field]: this.value }
    console.log("filtering by ", newObject)
    this.simpleSearch.emit(newObject);
  }

  constructor(private translate: TranslateService) { }


}