import { Component } from '@angular/core';
import { Mode, ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  currentMode: Mode = 'light';

  constructor(private themeService: ThemeService) {
    this.themeService.currentState$.subscribe(state => {
      this.currentMode = state.mode;
    });
  }

  toggleTheme() {
    const newMode = this.currentMode === 'light' ? 'dark' : 'light';
    this.themeService.setMode(newMode);
  }
}