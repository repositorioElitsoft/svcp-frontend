import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="chips-wrapper">
      <div class="chips-grid">
        <div *ngFor="let item of visibleItems" class="chip">
          <span class="task-id">{{item.tareaId}}</span>
          <span class="task-desc">{{item.descripcion}}</span>
        </div>
      </div>
      <button *ngIf="showMoreButton" class="more-button" (click)="onMoreClick()">
        (+ {{items.length - maxVisible}} más)
      </button>
    </div>
  `,
  styles: [`
    .chips-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .chips-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      width: 100%;
    }

    .chip {
      background-color: rgb(243, 242, 241);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: auto;
      height: 24px;
      color: #333;
    }

    .task-id {
      font-weight: bold;
      color: rgb(0, 120, 212);
    }

    .task-desc {
      color: #666;
    }

    .more-button {
      color: rgb(0, 120, 212);
      background: none;
      border: none;
      padding: 0;
      font-size: 13px;
      cursor: pointer;
      align-self: flex-start;
      margin-top: 2px;
    }

    .more-button:hover {
      text-decoration: underline;
    }
  `]
})
export class ChipsComponent {
  private _items: any[] = [];

  @Input()
  set items(value: any[]) {
    this._items = value || [];
  }
  get items(): any[] {
    return this._items;
  }

  @Input() maxVisible: number = 4;

  get visibleItems() {
    return this.items?.slice(0, this.maxVisible) || [];
  }

  get showMoreButton() {
    return this.items?.length > this.maxVisible;
  }

  onMoreClick(): void {
    // Implementar lógica para mostrar más items si es necesario
    console.log('Mostrar más items');
  }
} 