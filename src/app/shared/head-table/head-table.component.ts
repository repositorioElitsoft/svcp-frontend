import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { PerfilComponent } from '../components/perfil/perfil.component';

@Component({
  selector: 'app-head-table',
  standalone: true,
  imports: [ThemeToggleComponent, PerfilComponent],
  templateUrl: './head-table.component.html',
  styleUrl: './head-table.component.css'
})
export class HeadTableComponent {


}
