import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    this.show = this.router.url !== '/login';
  }



}
