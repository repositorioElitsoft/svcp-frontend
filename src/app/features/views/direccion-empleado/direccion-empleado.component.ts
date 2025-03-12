import { Component, OnInit } from '@angular/core';
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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Empleado ID:', this.id);
  }
}
