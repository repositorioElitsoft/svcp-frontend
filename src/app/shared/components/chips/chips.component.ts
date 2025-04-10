import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
                <span class="task-id">{{getDisplayValue(item) || 'Sin descripción'}}</span>
              </div>
              <button class="delete-button" (click)="onDelete(item)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        </div>
        <div *ngIf="showMoreIndicator" class="more-indicator">
          (+ más)
        </div>
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
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
    }

    @media (min-width: 640px) {
      .chips-wrapper {
        flex-direction: row;
        align-items: center;
      }
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
      min-width: 110px;
      max-width: 200px;
    }

    .chip-content {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      flex: 1;
    }

    .task-id {
      color: #616161;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      width: 100%;
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

    .more-indicator {
      color: rgb(37 99 235);
      cursor: pointer;
      white-space: nowrap;
      font-size: 13px;
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
  private screenWidth: number = window.innerWidth;

  @Input() displayField: string = ''; // Campo a mostrar
  @Input() nestedPath: string = ''; // Ruta anidada para acceder al campo (ejemplo: 'tarea.descripcionTarea')

  @Input()
  set items(value: any[]) {
    this._items = value || [];
  }
  get items(): any[] {
    return this._items;
  }

  @Output() deleteItem = new EventEmitter<any>();
  @Output() clearAll = new EventEmitter<void>();

  getDisplayValue(item: any): string {
    if (!item) return '';

    if (this.nestedPath) {
      return this.nestedPath.split('.').reduce((obj, key) => obj?.[key], item) || '';
    }

    return item[this.displayField] || '';
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.updateMaxVisible();
  }

  ngOnInit() {
    this.updateMaxVisible();
  }

  private updateMaxVisible() {
    if (this.screenWidth >= 1024) {
      this.currentMaxVisible = 4; // Desktop
    } else if (this.screenWidth >= 640) {
      this.currentMaxVisible = 3; // Tablet
    } else {
      this.currentMaxVisible = 1; // Mobile
    }
  }

  get visibleItems() {
    return this.items?.slice(0, this.currentMaxVisible) || [];
  }

  get showMoreIndicator(): boolean {
    return (this.items?.length || 0) > this.currentMaxVisible;
  }

  getVisibleRows(): any[][] {
    const visibleItems = this.visibleItems;
    const rows: any[][] = [];
    const itemsPerRow = this.screenWidth < 640 ? 1 : 2;

    for (let i = 0; i < visibleItems.length; i += itemsPerRow) {
      rows.push(visibleItems.slice(i, i + itemsPerRow));
    }

    return rows;
  }

  onDelete(item: any): void {
    this.deleteItem.emit(item);
  }
} 