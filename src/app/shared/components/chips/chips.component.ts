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
          <div class="chips-row" *ngFor="let row of getVisibleRows()">
            <div *ngFor="let item of row" class="chip">
              <div class="chip-content">
                <span class="task-id">{{item.tareaId}}</span>
              </div>
              <button class="delete-button" (click)="onDelete(item)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
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
      max-width: 300px;
    }

    .chips-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 4px;
      align-items: flex-start;
    }

    .chips-grid {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 4px;
      max-width: 250px;
    }

    .chips-row {
      display: flex;
      gap: 4px;
    }

    .chip {
      background: #ccc2ac;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      height: 24px;
      width: 110px;
    }

    .chip-content {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
    }

    .task-id {
      color: #616161;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .delete-button:hover {
      color: #616161;
    }

    .more-button {
      color: rgb(0, 120, 212);
      background: none;
      border: none;
      padding: 2px 4px;
      font-size: 13px;
      cursor: pointer;
      white-space: nowrap;
      margin-left: 4px;
    }

    .more-button:hover {
      text-decoration: underline;
    }

    mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      line-height: 14px;
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

  getVisibleRows(): any[][] {
    const visibleItems = this.visibleItems;
    const rows: any[][] = [];

    for (let i = 0; i < visibleItems.length; i += 2) {
      rows.push(visibleItems.slice(i, i + 2));
    }

    return rows;
  }

  onDelete(item: any): void {
    this.deleteItem.emit(item);
  }

  onMoreClick(): void {
    this.maxVisible = this.items.length;
  }
} 