import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ThemeService, Theme, Mode } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToggleGroupComponent } from '../toggle-group/toggle-group-component.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; // Importa TranslateService
import { FormControl } from '@angular/forms'; // Para el MatAutocomplete
import { Observable } from 'rxjs'; // Para el MatAutocomplete
import { startWith, map as rxjsMap } from 'rxjs/operators'; // Para el MatAutocomplete
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-dialogo-accesibilidad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    ToggleGroupComponent,
    ReactiveFormsModule,
    MatAutocompleteModule,
    TranslateModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dialogo-accesibilidad.component.html',
  styleUrl: './dialogo-accesibilidad.component.css',
})
export class DialogoAccesibilidadComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogoAccesibilidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private themeService: ThemeService,
    private translate: TranslateService // Inyecta TranslateService
  ) { }

  initialMode = '';

  themeState$ = this.themeService.currentState$;

  themes: { value: Theme; label: string }[] = [
    { value: 'indigo-pink', label: 'Indigo & Pink' },
    { value: 'deeppurple-amber', label: 'Deep Purple & Amber' },
    { value: 'pink-bluegrey', label: 'Pink & Blue Grey' },
    { value: 'purple-green', label: 'Purple & Green' },
  ];

  colorModes = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'system', label: 'Sistema' },
  ];
  selectedColorMode = 'light';

  fontSizes = [
    { value: 'small', label: 'A-' },
    { value: 'medium', label: 'A' },
    { value: 'large', label: 'A+' },
  ];
  selectedFontSize = 'medium';

  // Nuevas propiedades para el selector de idioma
  languageControl = new FormControl();
  languages: string[] = ['Español', 'English', 'Português'];
  filteredLanguages!: Observable<string[]>;
  selectedLanguage: string = 'Español';

  ngOnInit() {
    const option = localStorage.getItem('theme-option') ?? 'system';
    this.initialMode = option;

    // Configura el idioma inicial
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    this.translate.use(savedLanguage);
    this.selectedLanguage = this.getLanguageName(savedLanguage);

    // Configura el MatAutocomplete
    this.filteredLanguages = this.languageControl.valueChanges.pipe(
      startWith(''),
      rxjsMap((value) => this._filterLanguages(value))
    );
  }

  // Filtra los idiomas para el MatAutocomplete
  private _filterLanguages(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.languages.filter((language) =>
      language.toLowerCase().includes(filterValue)
    );
  }

  // Maneja la selección de idioma
  onLanguageSelected(event: any) {
    const selectedLanguage = event.option.value;
    const languageCode = this.getLanguageCode(selectedLanguage);

    // Cambia el idioma en toda la aplicación
    this.translate.use(languageCode);

    // Guarda la selección en localStorage
    localStorage.setItem('selectedLanguage', languageCode);

    // Actualiza el idioma seleccionado en el botón
    this.selectedLanguage = selectedLanguage;
  }

  // Convierte el nombre del idioma a su código
  getLanguageCode(language: string): string {
    switch (language) {
      case 'Español':
        return 'es';
      case 'English':
        return 'en';
      case 'Português':
        return 'pt';
      default:
        return 'es';
    }
  }

  // Convierte el código del idioma a su nombre
  getLanguageName(code: string): string {
    switch (code) {
      case 'es':
        return 'Español';
      case 'en':
        return 'English';
      case 'pt':
        return 'Português';
      default:
        return 'Español';
    }
  }

  onColorModeChange(mode: string) {
    console.log('Selected color mode:', mode);

    let newMode = 'light';

    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      if (prefersDark.matches) {
        newMode = 'dark';
      }
    }
    if (mode === 'dark') {
      newMode = 'dark';
    }
    localStorage.setItem('theme-option', mode);

    this.themeService.setMode(newMode as Mode);
  }

  changeTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  isDarkMode$ = this.themeState$.pipe(map((state) => state.mode === 'dark'));

  onFontSizeChange(size: string) {
    console.log('Selected font size:', size);
  }
}