import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { BusquedaComponent } from '../../shared/components/busqueda/busqueda.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { PerfilComponent } from '../../shared/components/perfil/perfil.component';
import { CalendarioEventoComponent } from '../../shared/components/calendario-evento/calendario-evento.component';
import { TituloParametrizadoComponent } from '../../shared/components/titulo-parametrizado/titulo-parametrizado.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

// Configuración de Swiper
Swiper.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    BusquedaComponent,
    SidebarComponent,
    ThemeToggleComponent,
    PerfilComponent,
    CalendarioEventoComponent,
    TituloParametrizadoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agregar esto para evitar errores con Swiper
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  images: string[] = [
    "sliderhome1.png", "sliderhome2.png", "sliderhome3.png", "sliderhome4.png"
  ];


  ejecutarBusqueda(query: string) {
    console.log('Buscando:', query);
    // Aquí llamas al servicio para obtener resultados del backend
  }

  getImageRoute(image: string) {
    return `assets/${image}`;  // Asegúrate de que las imágenes están en la carpeta 'assets/'
  }

}
