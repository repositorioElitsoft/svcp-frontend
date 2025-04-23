import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ExpansionPanelLocacionComponent } from '../../../shared/components/expansion-panel-locacion/expansion-panel-locacion.component';
import { LocacionesEmpleadoFormComponent } from '../../../shared/components/sub-forms/locaciones-empleado-form/locaciones-empleado-form.component';

@Component({
  selector: 'app-direccion-empleado',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule, LocacionesEmpleadoFormComponent, ExpansionPanelLocacionComponent
  ],
  templateUrl: './direccion-empleado.component.html',
  styleUrls: ['./direccion-empleado.component.css']
})
export class DireccionEmpleadoComponent implements OnInit {
  id: string | null = null;
  idDireccionParaEditar: number | null = null;

  @ViewChild(ExpansionPanelLocacionComponent) expansionPanelLocacion: ExpansionPanelLocacionComponent | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Empleado ID:', this.id);
  }

  // Método para manejar el evento del formulario
  onFormularioEnviado() {
    console.log("Formulario enviado exitosamente.");
    this.actualizarData();
  }

  // Método para actualizar los datos en el hijo app-expansion-panel-locacion
  actualizarData() {
    if (this.expansionPanelLocacion) {
      this.expansionPanelLocacion.obtenerDireccionEmpleado(); // Llama al método del hijo para actualizar la data
    }
  }
  onEditarDireccion(id: number) {
    this.idDireccionParaEditar = id;  // Aquí recibimos el id como un número
    console.log('ID recibido en onEditarDireccion:', id);  // Mostramos el id en la consola
  }



}
