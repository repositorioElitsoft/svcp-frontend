import { Component } from '@angular/core';
import { BusquedaComponent } from '../components/busqueda/busqueda.component';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { PerfilComponent } from '../components/perfil/perfil.component';

@Component({
  selector: 'app-head-table',
  standalone: true,
  imports: [BusquedaComponent, ThemeToggleComponent, PerfilComponent],
  templateUrl: './head-table.component.html',
  styleUrl: './head-table.component.css'
})
export class HeadTableComponent {

  ejecutarBusqueda(query: string) {
    console.log('Buscando:', query);
    // Aquí llamas al servicio para obtener resultados del backend
  }

}
