import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-dialog',
  standalone: true,
  imports: [MatIcon, TranslateModule, MatCardModule],
  templateUrl: './perfil-dialog.component.html',
  styleUrls: ['./perfil-dialog.component.css']
})
export class PerfilDialogComponent {
  constructor(private dialogRef: MatDialogRef<PerfilDialogComponent>, private router: Router) { }

  cerrarSesion() {
    console.log('Cerrar sesión');
    localStorage.removeItem("token")
    this.router.navigate(['login'])
    this.dialogRef.close();
  }
}