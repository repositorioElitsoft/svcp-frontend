import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChildren } from '@angular/core';
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
  @Input() isForForms: boolean = false;
  @Output() linkClick = new EventEmitter<string>();
  menus: any = [];
  show = true;
  @Input() title: string = "";
  @Input() img: string = "./assets/Logo.svg";
  @Input() routesRoute: string = "/assets/routes.json"

  constructor(private http: HttpClient, private router: Router, private elementRef: ElementRef) {

  }

  ngOnInit(): void {
    this.http.get(this.routesRoute).subscribe((data) => {
      this.menus = data;
    });
    this.checkRoute();
    this.router.events.subscribe(() => this.checkRoute());
  }

  private checkRoute() {
    this.show = this.router.url !== '/login';
  }

  handleLinkClick(link: string) {
    if (this.isForForms) {
      this.linkClick.emit(link);
    } else {
      this.router.navigate([link]);
    }
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
