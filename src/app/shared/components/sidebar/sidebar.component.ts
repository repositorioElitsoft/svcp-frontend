import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpansionPanelComponent } from "../expansion-panel/expansion-panel.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SidebarItemLinkComponent } from "../sidebar-item-link/sidebar-item-link.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ExpansionPanelComponent,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    SidebarItemLinkComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChildren('panel') expansionPanels!: QueryList<ExpansionPanelComponent>;
  isExpanded: boolean = false;
  menus: any = [];
  show = true;
  @Input() title: string = "";
  @Input() img: string = "./assets/Logo.svg";

  constructor(private http: HttpClient, private router: Router, private elementRef: ElementRef) {
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

  handleShrink(index: number) {
    this.expansionPanels.forEach((panel, i) => {
      if (i === index) {
        if (!this.isExpanded) {
          this.isExpanded = true;
          this.togglePanels();
          setTimeout(() => { panel.toggleExpand() }, 150);
        }
      }
    });
  }

  onExpandPressed() {
    this.isExpanded = !this.isExpanded;
    this.togglePanels();
  }

  openMobileSideBar() {
    this.isExpanded = true;
    this.togglePanels();
  }

  togglePanels() {
    this.expansionPanels.forEach(panel => {
      panel.isShrinked = !panel.isShrinked;
      if (!this.isExpanded) {
        panel.shrink();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isExpanded && !this.elementRef.nativeElement.contains(event.target)) {
      this.isExpanded = false;
      this.togglePanels();
    }
  }
}
