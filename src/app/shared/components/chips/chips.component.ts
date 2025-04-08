import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="chips-container">
      <div class="chips-wrapper">
        <div class="chips-grid">
          <div *ngFor="let item of visibleItems" class="chip">
            <div class="chip-content">
              <span class="task-id">#{{item.tareaId}}</span>
              <span class="task-desc">{{item.descripcion}}</span>
            </div>
            <button class="delete-button" (click)="onDelete(item)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
        <button *ngIf="showMoreButton" class="more-button" (click)="onMoreClick()">
          (+ {{items.length - maxVisible}} más)
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chips-container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .chips-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      padding: 8px 14px;
      border-radius: 8px;
    }

    .chips-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
    }

    .chip {
      background: #ccc2ac;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 28px;
    }

    .chip-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .task-id {
      font-weight: 500;
      color: #616161;
    }

    .task-desc {
      color: #616161;
    }

    .delete-button {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9E9E9E;
      min-width: 18px;
      min-height: 18px;
    }

    .delete-button:hover {
      color: #616161;
    }

    .more-button {
      color: rgb(0, 120, 212);
      background: none;
      border: none;
      padding: 4px 8px;
      font-size: 13px;
      cursor: pointer;
      align-self: flex-start;
    }

    .more-button:hover {
      text-decoration: underline;
      background: rgba(0, 120, 212, 0.1);
      border-radius: 4px;
    }

    mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
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
  @Output() deleteItem = new EventEmitter<any>();
  @Output() clearAll = new EventEmitter<void>();

  get visibleItems() {
    return this.items?.slice(0, this.maxVisible) || [];
  }

  get showMoreButton() {
    return this.items?.length > this.maxVisible;
  }

  onDelete(item: any): void {
    this.deleteItem.emit(item);
  }

  onMoreClick(): void {
    this.maxVisible = this.items.length;
  }
} 