import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-titulo-dialogo',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './titulo-dialogo.component.html',
  styleUrl: './titulo-dialogo.component.css'
})
export class TituloDialogoComponent {
  @Input() title: string = "";
  @Input() icon: string = "";
  @Input() ref!: MatDialogRef<any>
  @Input() closeData: any
  @Input() fontSizeClass: string = 'text-lg'; // Valor por defecto

  close() {
    if (this.closeData) {
      this.ref.close(this.closeData)
      return;
    }
    this.ref.close()
  }
}