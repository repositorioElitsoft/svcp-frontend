import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { TranslateModule } from "@ngx-translate/core"

@Component({
  selector: "app-opciones-mantenedor",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  template: `
<div class="flex items-center justify-between gap-3 text-lg flex-col sm:flex-row w-full">
  
  <!-- Contenedor de Agregar y Exportar -->
  <div class="flex items-center gap-3 w-full sm:w-auto flex-col sm:flex-row">
    
    <button class="elitsoft-btn w-full sm:w-auto flex items-center justify-center gap-2" (click)="onAgregar()">
      <mat-icon>add</mat-icon>
      <span>{{ 'opciones-mantenedor.botonAgregar.texto' | translate }}</span>
    </button>

    <button class="elitsoft-warn w-full sm:w-auto flex items-center justify-center gap-2" (click)="onExportar()" >
      <mat-icon>download</mat-icon>
      <span>{{ 'opciones-mantenedor.botonExportar.texto' | translate }}</span>
    </button>
  </div>

  <!-- Contenedor del botón de eliminar -->
  <div class="flex justify-end w-full sm:w-auto">
    <button [disabled]="!hasSelection"
            class="elitsoft-btn-icon flex items-center justify-center gap-2"
            (click)="onEliminar()">
      <mat-icon>delete</mat-icon>
    </button>
  </div>

</div>

  `,
  styles: [
    `
    :host {
      display: block;
    }
    .mat-mdc-flat-button,
    .mat-mdc-stroked-button {
      line-height: 40px;
    }
    .mat-mdc-button-base {
      --mdc-typography-button-letter-spacing: 0;
      --mdc-typography-button-text-transform: none;
    }
  `,
  ],
})
export class OpcionesMantenedorComponent {
  @Input() botonAgregar = { texto: "Agregar servicio", accion: () => { } }
  @Input() botonExportar = { texto: "Exporta excel", accion: () => { } }
  @Input() botonConfig = { accion: () => { } }
  @Input() botonEliminar = { accion: () => { } }
  @Input() hasSelection = false;
  @Input() selectedData: any[] = []; // Recibe los datos seleccionados

  @Output() agregar = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<any[]>(); // Emitimos los datos seleccionados para exportar
  @Output() config = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<any[]>(); // Emitimos los datos seleccionados para eliminar

  onAgregar() {
    this.botonAgregar.accion();
    this.agregar.emit();
  }

  onExportar() {
    console.log("Esta es la data que exportarás:", this.selectedData);
    this.botonExportar.accion();
    console.log("Solicitando exportación de datos"); // Verificar que se está emitiendo el evento
    this.exportar.emit(this.selectedData); // Emitimos la data seleccionada
  }


  onConfig() {
    this.botonConfig.accion();
    this.config.emit();
  }

  onEliminar() {
    this.botonEliminar.accion();
    console.log("Eliminando:", this.selectedData); // Verificar datos antes de emitir
    this.eliminar.emit(this.selectedData); // Emitimos la data seleccionada
  }
}
