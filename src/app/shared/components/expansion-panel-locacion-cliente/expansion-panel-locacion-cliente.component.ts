import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DireccionEmpleado } from '../../../core/models/direccion-empleado.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';
import { DialogAlertaComponent } from '../../dialogo-alerta/dialogo-alerta.component';
import { MatDialog } from '@angular/material/dialog';
import { DireccionService } from '../../../core/services/direccion.service';

@Component({
  selector: 'app-expansion-panel-locacion-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './expansion-panel-locacion-cliente.component.html',
})
export class ExpansionPanelLocacionClienteComponent implements OnInit {

  @Input() id: string | null = null;
  @Output() editarDireccionEvent = new EventEmitter<number>(); // Emitir el id de la dirección

  direccionEmpleados: DireccionEmpleado[] = [];
  mensajeNoDatos: string = 'No hay locaciones registradas. Agrega una para comenzar.';
  panelOpenState = false;

  constructor(private direccionClienteService: DireccionService,
    private translate: TranslateService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.id);
    if (this.id) {
      this.obtenerDireccionCliente();
    }
  }

  obtenerDireccionCliente() {
    if (this.id) {
      const filtros = {
        clienteId: this.id,
        sortField: 'id',
        sortDirection: 'ASC'
      };
      this.direccionClienteService.buscarFiltrado(filtros).subscribe((response: any) => {
        if (response.content && Array.isArray(response.content)) {
          this.direccionEmpleados = response.content;
          console.log(this.direccionEmpleados);
        } else {
          console.log('No se encontraron direcciones');
        }
      });
    } else {
      console.log('ID no válido');
    }
  }

  // Nuevo método para actualizar los datos
  actualizarData() {
    console.log('Actualizando datos en el componente hijo...');
    this.obtenerDireccionCliente();  // Llama a obtenerDireccionEmpleado para actualizar la data
  }

  obtenerInformacionNoDisponible(value: any): string {
    return value ? value : 'Información no disponible';
  }

  eliminarDireccion(id: number) {
    console.log("Eliminar seleccionado:", id);

    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.direccionEmpleado.titulo');
    const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
    const textoBotonCancelar = this.translate.instant('alertas.cancelar');
    const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: titulo,
        mensaje: mensaje,
        textoBotonCancelar: textoBotonCancelar,
        textoBotonConfirmar: textoBotonConfirmar
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.direccionClienteService.borrar(id, Number(this.id)).subscribe({
          next: () => {
            console.log('Dirección eliminada correctamente');
            this.obtenerDireccionCliente(); // Recargar la lista después de eliminar
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

  editarDireccion(id: number) {
    this.editarDireccionEvent.emit(id);
  }

}
