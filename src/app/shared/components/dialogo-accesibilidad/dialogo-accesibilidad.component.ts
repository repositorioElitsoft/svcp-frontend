import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ThemeService, Theme, Mode } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToggleGroupComponent } from '../toggle-group/toggle-group-component.component';

@Component({
  selector: 'app-dialogo-accesibilidad',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    ToggleGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dialogo-accesibilidad.component.html',
  styleUrl: './dialogo-accesibilidad.component.css'
})



export class DialogoAccesibilidadComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogoAccesibilidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private themeService: ThemeService
  ) { }

  initialMode = "";

  themeState$ = this.themeService.currentState$;

  themes: { value: Theme; label: string }[] = [
    { value: 'indigo-pink', label: 'Indigo & Pink' },
    { value: 'deeppurple-amber', label: 'Deep Purple & Amber' },
    { value: 'pink-bluegrey', label: 'Pink & Blue Grey' },
    { value: 'purple-green', label: 'Purple & Green' }
  ];


  colorModes = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'system', label: 'Sistema' }
  ];
  selectedColorMode = 'light';

  fontSizes = [
    { value: 'small', label: 'A-' },
    { value: 'medium', label: 'A' },
    { value: 'large', label: 'A+' }
  ];
  selectedFontSize = 'medium';



  ngOnInit() {
    const option = localStorage.getItem("theme-option") ?? "system"
    this.initialMode = option
  }

  onColorModeChange(mode: string) {
    // Handle color mode change logic
    console.log('Selected color mode:', mode);

    let newMode = 'light'

    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      if (prefersDark.matches) {
        newMode = 'dark'
      }
    }
    if (mode === 'dark') {
      newMode = 'dark'
    }
    localStorage.setItem("theme-option", mode)

    this.themeService.setMode(newMode as Mode);

  }

  changeTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }


  isDarkMode$ = this.themeState$.pipe(
    map(state => state.mode === 'dark')
  );

  onFontSizeChange(size: string) {
    // Handle font size change logic
    console.log('Selected font size:', size);
  }
}
