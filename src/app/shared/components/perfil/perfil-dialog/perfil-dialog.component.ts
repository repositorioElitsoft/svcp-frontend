import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-perfil-dialog',
  standalone: true,
  imports: [MatIcon, TranslateModule, MatCardModule],
  templateUrl: './perfil-dialog.component.html',
  styleUrls: ['./perfil-dialog.component.css']
})
export class PerfilDialogComponent {
  constructor(private dialogRef: MatDialogRef<PerfilDialogComponent>) { }

  cerrarSesion() {
    this.dialogRef.close();
  }
}