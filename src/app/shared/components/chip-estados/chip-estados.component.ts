import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-chip-estados',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <span class="estado-chip" [ngClass]="getEstadoClass()">
      {{ estado?.descripcion || 'Sin Info' }}
    </span>
  `,
  styles: [`
    .estado-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
      text-align: center;
    }

    .estado-activo {
      background-color: #E8F5E9;
      color: #2E7D32;
    }

    .estado-habilitado {
      background-color: #E8F5E9;
      color: #2E7D32;
    }

    .estado-cancelado {
      background-color: #FFEBEE;
      color: #C62828;
    }

    .estado-pendiente {
      background-color: #FFF3E0;
      color: #EF6C00;
    }

    .estado-observacion {
      background-color: #E3F2FD;
      color: #1565C0;
    }

    .estado-terminado {
      background-color: #E8EAF6;
      color: #283593;
    }

    .estado-eliminado {
      background-color: #EFEBE9;
      color: #4E342E;
    }

    .estado-no-realizado {
      background-color: #FCE4EC;
      color: #AD1457;
    }

    .estado-sin-info {
      background-color: #F5F5F5;
      color: #616161;
    }
  `]
})
export class ChipEstadosComponent {
  @Input() estado: { id: number; descripcion: string } | null = null;

  getEstadoClass(): string {
    if (!this.estado) return 'estado-sin-info';

    const estadoMap: { [key: number]: string } = {
      0: 'estado-sin-info',
      1: 'estado-habilitado',
      2: 'estado-cancelado',
      3: 'estado-pendiente',
      4: 'estado-observacion',
      5: 'estado-terminado',
      6: 'estado-eliminado',
      7: 'estado-no-realizado'
    };

    return estadoMap[this.estado.id] || 'estado-sin-info';
  }
} 