import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoProductoTipoComponente } from '../../../core/models/tipo-producto-tipo.componente.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tipo-componente-asignacion',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <div class="space-y-2">
      <div *ngFor="let item of tiposComponentes" 
           class="h-[24.23px] bg-[#ededed] rounded-lg grid grid-cols-3">
        <!-- Columna 1: Nombre -->
        <div class="px-3 py-0.5 text-[#424242] text-base font-semibold font-['Roboto'] flex items-center truncate overflow-hidden">
          <span class="truncate" [title]="item.tipoComponente.nombre">{{item.tipoComponente.nombre}}</span>
        </div>
        <!-- Columna 2: Controles de cantidad -->
        <div class=" flex justify-center items-center">
          <div class="inline-flex items-center gap-2">
            <button (click)="decrementarCantidad(item)"
                    class="w-[20.06px] h-[20.06px] bg-[#3f51b5] rounded-md flex justify-center items-center border-0 min-w-0">
              <span class="text-white text-lg font-medium leading-none">-</span>
            </button>
            <span class="w-[20px] text-center text-black text-lg font-semibold font-['Roboto'] leading-none">
              {{item.cantidad}}
            </span>
            <button (click)="incrementarCantidad(item)"
                    class="w-[20.06px] h-[20.06px] bg-[#3f51b5] rounded-md flex justify-center items-center border-0 min-w-0">
              <span class="text-white text-lg font-medium leading-none">+</span>
            </button>
          </div>
        </div>
        <!-- Columna 3: Botón eliminar -->
        <div class=" flex justify-end items-center px-3">
          <button mat-icon-button (click)="onRemove(item)" 
                  class="!w-5 !h-5 !p-0">
            <mat-icon class="!text-[#c0392b]">delete</mat-icon>
          </button>
        </div>
      </div>
      

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    button {
      cursor: pointer;
    }
    button:hover {
      opacity: 0.9;
    }
    :host ::ng-deep .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }
  `]
})
export class TipoComponenteAsignacionComponent {
  @Input() tiposComponentes: TipoProductoTipoComponente[] = [];
  @Output() removeItem = new EventEmitter<TipoProductoTipoComponente>();
  @Output() cantidadChanged = new EventEmitter<{ item: TipoProductoTipoComponente, cantidad: number }>();

  incrementarCantidad(item: TipoProductoTipoComponente) {
    item.cantidad++;
    this.cantidadChanged.emit({ item, cantidad: item.cantidad });
  }

  decrementarCantidad(item: TipoProductoTipoComponente) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.cantidadChanged.emit({ item, cantidad: item.cantidad });
    }
  }

  onRemove(item: TipoProductoTipoComponente) {
    this.removeItem.emit(item);
  }
} 