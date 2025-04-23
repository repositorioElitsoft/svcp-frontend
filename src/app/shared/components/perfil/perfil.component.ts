import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { PerfilDialogComponent } from './perfil-dialog/perfil-dialog.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [MatDialogModule], // Changed from MatDialog to MatDialogModule
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  constructor(private dialog: MatDialog) { }

  openPerfilDialog(event: MouseEvent) {
    const dialogRef = this.dialog.open(PerfilDialogComponent, {
      width: '400px',
      height: '300px',
      panelClass: ['custom-dialog-container', 'dark:bg-neutral-800'],
      position: {
        top: `${event.clientY + 10}px`,           // Posición vertical hacia abajo (con un margen de 10px)
        left: `${event.clientX - 420}px`          // Posición horizontal hacia la izquierda (restando el ancho del diálogo)
      }
    });
  }



}