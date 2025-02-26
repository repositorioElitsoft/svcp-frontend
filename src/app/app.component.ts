import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { TranslateService } from '@ngx-translate/core'; // Importa TranslateService
import { FontSizeService } from './core/services/font-size.service';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrige el nombre del archivo de estilos
})
export class AppComponent implements OnInit {
  title = 'svcp-frontend';
  selectedFontSize!: string;

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService, // Inyecta TranslateService
    private fontSizeService: FontSizeService // Inyecta FontSizeService
  ) {
    this.configureLanguage(); // Configura el idioma al iniciar la aplicación
  }

  ngOnInit(): void {
    // Cargar el tamaño de fuente desde el servicio
    this.selectedFontSize = this.fontSizeService.getSelectedFontSize();
  }

  private configureLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es'; // Recupera el idioma guardado o usa 'es' como predeterminado
    this.translate.setDefaultLang('es'); // Establece el idioma predeterminado
    this.translate.use(savedLanguage); // Usa el idioma guardado en localStorage
  }
}
