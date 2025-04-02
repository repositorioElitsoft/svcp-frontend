import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar-item-link',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    template: `
    <a [routerLink]="link" class="flex items-center gap-4 px-4 py-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors duration-200">
      <span class="material-symbols-outlined text-2xl">{{icon || 'circle'}}</span>
      <span class="text-xl">{{title | translate}}</span>
    </a>
  `
})
export class SidebarItemLinkComponent {
    @Input() link: string = '';
    @Input() title: string = '';
    @Input() icon: string = '';
} 