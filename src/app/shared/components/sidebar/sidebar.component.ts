import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpansionPanelComponent } from "../expansion-panel/expansion-panel.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ExpansionPanelComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChildren('panel') expansionPanels!: QueryList<ExpansionPanelComponent>;
  isExpanded: boolean = false;

  onExpandPressed() {
    this.isExpanded = !this.isExpanded;
    this.togglePanels();
  }

  togglePanels() {
    // Iterate over each panel and toggle the isShrinked property
    this.expansionPanels.forEach(panel => {
      panel.isShrinked = !panel.isShrinked;
    });
  }


}
