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
  @Output() valueChange = new EventEmitter<{ field: string; value: string }>();

  onValueChange() {
    this.valueChange.emit({ field: this.field, value: this.value });
  }


  constructor(private translate: TranslateService) { }


}