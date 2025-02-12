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

  openPerfilDialog() {
    this.dialog.open(PerfilDialogComponent, {
      width: '400px',
      height: '300px',
      panelClass: ['custom-dialog-container', 'dark:bg-neutral-800']
    });
  }

}