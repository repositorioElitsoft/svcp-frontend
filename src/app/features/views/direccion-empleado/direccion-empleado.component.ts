import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  // Ensure this is imported correctly
import { LocacionesFormComponent } from '../../../shared/components/sub-forms/locaciones-form/locaciones-form.component';

@Component({
  selector: 'app-direccion-empleado',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule, LocacionesFormComponent
  ],
  templateUrl: './direccion-empleado.component.html',
  styleUrls: ['./direccion-empleado.component.css']  // Corrected property name (should be 'styleUrls' instead of 'styleUrl')
})
export class DireccionEmpleadoComponent {
  id: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Empleado ID:', this.id);
  }
}
