import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { BusquedaComponent } from '../../shared/components/busqueda/busqueda.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, BusquedaComponent], // Agrega CommonModule para Tailwind
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  ejecutarBusqueda(query: string) {
    console.log('Buscando:', query);
    // Aquí llamas al servicio para obtener resultados del backend
  }
}
