import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"

@Component({
  selector: "app-opciones-mantenedor",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <button 
          class="elitsoft-btn"
          (click)="onAgregar()">
          <mat-icon>add</mat-icon>
          {{ botonAgregar.texto }}
        </button>

        <button 
          class="elitsoft-btn"
          (click)="onExportar()"
        >
          <mat-icon >download</mat-icon>
          Exporta excel
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button 
          mat-icon-button 
          class="text-gray-600 hover:text-gray-800"
          (click)="onConfig()"
        >
          <mat-icon>settings</mat-icon>
        </button>

        <button 
          mat-icon-button 
          class="text-gray-600 hover:text-red-600"
          (click)="onEliminar()"
        >
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

  @Output() agregar = new EventEmitter<void>()
  @Output() exportar = new EventEmitter<void>()
  @Output() config = new EventEmitter<void>()
  @Output() eliminar = new EventEmitter<void>()

  onAgregar() {
    this.botonAgregar.accion()
    this.agregar.emit()
  }

  onExportar() {
    this.botonExportar.accion()
    this.exportar.emit()
  }

  onConfig() {
    this.botonConfig.accion()
    this.config.emit()
  }

  onEliminar() {
    this.botonEliminar.accion()
    this.eliminar.emit()
  }
}

