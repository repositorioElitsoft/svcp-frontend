import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DireccionEmpleadoService } from '../../../core/services/direccion-empleado.service';
import { DireccionEmpleado } from '../../../core/models/direccion-empleado.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';
import { DialogAlertaComponent } from '../../dialogo-alerta/dialogo-alerta.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-expansion-panel-locacion',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './expansion-panel-locacion.component.html',
  styleUrls: ['./expansion-panel-locacion.component.css']
})
export class ExpansionPanelLocacionComponent implements OnInit {

  @Input() id: string | null = null;
  direccionEmpleados: DireccionEmpleado[] = [];  // Cambiado a un arreglo
  mensajeNoDatos: string = 'No hay locaciones registradas. Agrega una para comenzar.';
  panelOpenState = false;

  constructor(private direccionEmpleadoService: DireccionEmpleadoService,
    private translate: TranslateService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.id);
    if (this.id) {
      this.obtenerDireccionEmpleado();
    }
  }

  obtenerDireccionEmpleado() {
    if (this.id) {
      const filtros = {
        empleadoId: this.id,
        sortField: 'id',
        sortDirection: 'ASC'
      };
      this.direccionEmpleadoService.buscarFiltrado(filtros).subscribe((response: any) => {
        // Verifica que la respuesta contenga la propiedad 'content' que es un arreglo
        if (response.content && Array.isArray(response.content)) {
          this.direccionEmpleados = response.content;  // Asigna el arreglo de direcciones
          console.log(this.direccionEmpleados);
        } else {
          console.log('No se encontraron direcciones');
        }
      });
    } else {
      console.log('ID no válido');
    }
  }

  obtenerInformacionNoDisponible(value: any): string {
    return value ? value : 'Información no disponible';
  }

  eliminarDireccion(id: number) {
    console.log("Eliminar seleccionado:", id);

    // Obtener las traducciones
    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.direccionEmpleado.titulo');
    const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
    const textoBotonCancelar = this.translate.instant('alertas.cancelar');
    const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

    // Abrir diálogo de confirmación
    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: titulo,
        mensaje: mensaje,
        textoBotonCancelar: textoBotonCancelar,
        textoBotonConfirmar: textoBotonConfirmar
      }
    });

    // Suscribirse a la respuesta del diálogo
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.direccionEmpleadoService.borrar(id).subscribe({
          next: () => {
            console.log('Dirección eliminada correctamente');
            this.obtenerDireccionEmpleado(); // Recargar la lista después de eliminar
            this.toastr.success(this.translate.instant('alertas.toastr.success'));
          },
          error: (err: any) => {
            console.error("Error al eliminar elemento:", err);
            this.toastr.error(this.translate.instant(convertErrorMessageToI18(err.message)));
          }
        });
      }
    });
  }


}


