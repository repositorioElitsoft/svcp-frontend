import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { LocacionesClienteFormComponent } from '../../../shared/components/sub-forms/locaciones-cliente-form/locaciones-cliente-form.component';
import { ExpansionPanelLocacionClienteComponent } from '../../../shared/components/expansion-panel-locacion-cliente/expansion-panel-locacion-cliente.component';

@Component({
  selector: 'app-locacion-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule, LocacionesClienteFormComponent, ExpansionPanelLocacionClienteComponent
  ],
  templateUrl: './locacion-cliente.component.html',
})
export class LocacionClienteComponent implements OnInit {
  id: string | null = null;
  idDireccionParaEditar!: number;

  @ViewChild(ExpansionPanelLocacionClienteComponent) expansionPanelLocacion: ExpansionPanelLocacionClienteComponent | undefined;
  @ViewChild('tabGroup') tabGroup: MatTabGroup | undefined; // Referencia a MatTabGroup

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  // Método para manejar el evento del formulario
  onFormularioEnviado() {
    console.log("Formulario enviado exitosamente.");
    this.actualizarData();
  }

  // Método para actualizar los datos en el hijo app-expansion-panel-locacion
  actualizarData() {
    if (this.expansionPanelLocacion) {
      this.expansionPanelLocacion.obtenerDireccionCliente(); // Llama al método del hijo para actualizar la data
    }
  }

  onEditarDireccion(id: number) {
    this.idDireccionParaEditar = id;  // Guardamos el id recibido
    console.log('ID recibido en onEditarDireccion:', id);

    // Cambiar la pestaña activa a "Agregar Dirección"
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
      this.cdr.detectChanges(); // Forzar actualización del template si es necesario
    }
  }

}
