import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-head-table',
  standalone: true,
  imports: [ThemeToggleComponent, PerfilComponent, CommonModule],
  templateUrl: './head-table.component.html',
  styleUrl: './head-table.component.css'
})
export class HeadTableComponent {
  show = true
  menus: any = []


  constructor(private http: HttpClient, private router: Router) {
    this.http.get('/assets/routes.json').subscribe((data) => {
      this.menus = data;

    });
  }
  ngOnInit(): void {
    this.checkRoute();
    this.router.events.subscribe(() => this.checkRoute());
  }

  private checkRoute() {

    switch (this.router.url) {
      case '/login':
        this.show = false;
        break;
      default:
        this.show = true
    }
  }
}
