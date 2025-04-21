import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule, MatButtonModule, TranslateModule],
  template: `
    <div class="chips-container">
      <div class="chips-wrapper">
        <div class="chips-grid">
          <div class="chips-row" *ngFor="let row of getVisibleRows()">
            <div *ngFor="let item of row" class="chip" (click)="onItemClick(item)">
              <div class="chip-content">
                <span class="task-id">{{getDisplayValue(item) || 'Sin descripción'}}</span>
              </div>
              <button class="delete-button" (click)="onDelete(item); $event.stopPropagation()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        </div>
        <div *ngIf="showMoreIndicator" class="more-indicator" (click)="onMoreClick()">
          <span>(+ {{ 'mantenedores.formularios.trabajo.label.mas' | translate }})</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chips-container {
      display: flex;
      flex-direction: column;
      max-width: 450px;
    }

    .chips-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .chips-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }

    .chips-row {
      display: flex;
      gap: 8px;
    }

    .chip {
      background: #e2ded5;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      height: 28px;
      width: 180px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .chip:hover {
      background: #d6d2c9;
    }

    .chip-content {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      flex: 1;
    }

    .task-id {
      color: #57534e;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      width: 100%;
      font-weight: 500;
    }

    .delete-button {
      border: none;
      background: #ccc2ad;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #57534e;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      border-radius: 2px;
      margin-right: -4px;
    }

    .delete-button:hover {
      background: #c0b69f;
    }

    .more-indicator {
      color: rgb(37 99 235);
      cursor: pointer;
      white-space: nowrap;
      font-size: 13px;
      display: flex;
      align-items: center;
      padding: 4px 0;
      margin-left: 8px;
    }

    .more-indicator:hover {
      color: rgb(30 64 175);
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
  private currentMaxVisible: number = 4;
  private showAll: boolean = false;
  public mostrarTodas: boolean = false;

  @Input() displayField: string = '';
  @Input() nestedPath: string = '';
  @Input() expandOnMore: boolean = false;

  @Input()
  set items(value: any[]) {
    this._items = value || [];
  }

  get items(): any[] {
    return this._items;
  }

  get visibleItems(): any[] {
    if (this.showAll && this.expandOnMore) {
      return this._items;
    }
    return this._items.slice(0, this.currentMaxVisible);
  }

  get showMoreIndicator(): boolean {
    return !this.showAll && this._items.length > this.currentMaxVisible;
  }

  @Output() deleteItem = new EventEmitter<any>();
  @Output() clearAll = new EventEmitter<void>();
  @Output() showMore = new EventEmitter<void>();
  @Output() itemClick = new EventEmitter<any>();

  getDisplayValue(item: any): string {
    if (!item) return '';

    if (this.nestedPath) {
      return this.nestedPath.split('.').reduce((obj, key) => obj?.[key], item) || '';
    }

    return item[this.displayField] || '';
  }

  getVisibleRows(): any[][] {
    const visibleItems = this.visibleItems;
    const rows: any[][] = [];
    const itemsPerRow = 2;

    for (let i = 0; i < visibleItems.length; i += itemsPerRow) {
      rows.push(visibleItems.slice(i, i + itemsPerRow));
    }

    return rows;
  }

  onItemClick(item: any): void {
    this.itemClick.emit(item);
  }

  onDelete(item: any): void {
    this.deleteItem.emit(item);
  }

  onMoreClick(): void {
    if (this.expandOnMore) {
      this.showAll = true;
    } else {
      this.showMore.emit();
    }
  }
} 