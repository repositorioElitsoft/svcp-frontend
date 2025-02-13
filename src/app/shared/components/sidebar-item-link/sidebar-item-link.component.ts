import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-item-link',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './sidebar-item-link.component.html',
  styleUrl: './sidebar-item-link.component.css'
})
export class SidebarItemLinkComponent {

  @Input() link: string = "";
  @Input() title: string = "";
}
