import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DialogAlertaData {
  titulo: string;
  mensaje: string;
  textoBotonCancelar: string;
  textoBotonConfirmar: string;
}

@Component({
  selector: 'app-dialog-alerta',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: 'dialogo-alerta.component.html',
})
export class DialogAlertaComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAlertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAlertaData
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
