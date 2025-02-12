import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { BusquedaComponent } from '../../shared/components/busqueda/busqueda.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { PerfilComponent } from '../../shared/components/perfil/perfil.component';
import { CalendarioEventoComponent } from '../../shared/components/calendario-evento/calendario-evento.component';
import { TituloParametrizadoComponent } from '../../shared/components/titulo-parametrizado/titulo-parametrizado.component';
import { CarouselHomeComponent } from '../../shared/components/carousel-home/carousel-home.component';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, BusquedaComponent, ThemeToggleComponent,
    PerfilComponent, CalendarioEventoComponent, TituloParametrizadoComponent, CarouselHomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  images: string[] = ["sliderhome1.png", "sliderhome2.png", "sliderhome3.png"]


  ejecutarBusqueda(query: string) {
    console.log('Buscando:', query);
    // Aquí llamas al servicio para obtener resultados del backend
  }


  getImageRoute(image: string) {
    return `assets/${image}`
  }

}
