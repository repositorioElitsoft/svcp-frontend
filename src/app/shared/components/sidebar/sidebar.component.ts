import { CommonModule } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpansionPanelComponent } from "../expansion-panel/expansion-panel.component";

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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

  menus: any = []
  @Input() title: string = ""
  @Input() img: string = ""

  constructor(private http: HttpClient) {

    this.http.get('/assets/routes.json').subscribe((data) => {
      this.menus = data;

    });
  }

  handleShrink(index: number) {
    console.log("attemp to shink", index)
    this.expansionPanels.forEach((panel, i) => {
      if (i === index) {
        if (!this.isExpanded) {
          this.isExpanded = true
          this.togglePanels();
          setTimeout(() => { panel.toggleExpand() }, 150)


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
    // Iterate over each panel and toggle the isShrinked property
    this.expansionPanels.forEach(panel => {
      panel.isShrinked = !panel.isShrinked;
      if (!this.isExpanded) {
        panel.shrink()
      }
    });
  }


}
