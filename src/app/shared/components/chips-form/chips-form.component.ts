import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

export interface ChipItem {
    id: number;
    displayText: string;
    [key: string]: any; // Permite propiedades adicionales
}

@Component({
    selector: 'app-chips-form',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        DragDropModule,
        TranslateModule
    ],
    template: `
        <div class="flex flex-col gap-2">
            <div [class]="containerClass">
                <div class="flex flex-col gap-2">
                    <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="flex flex-wrap gap-2">
                        <div *ngFor="let item of items.slice(0, mostrarTodos ? undefined : maxVisibleItems); let i = index"
                            cdkDrag [class]="chipClass">
                            <span [class]="textClass">{{ item[displayField] }}</span>
                            <button type="button" (click)="onItemDelete(item)"
                                [class]="deleteButtonClass">
                                ×
                            </button>
                        </div>
                    </div>
                    <div *ngIf="items.length > maxVisibleItems"
                        class="flex justify-end">
                        <button type="button"
                            class="flex items-center text-blue-600 cursor-pointer hover:text-blue-700"
                            (click)="toggleMostrarTodos()">
                            <mat-icon class="text-base mr-1">{{ mostrarTodos ? 'remove' : 'add' }}</mat-icon>
                            <span class="text-sm font-roboto">{{ (mostrarTodos ? verMenosTexto : verMasTexto) | translate }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            font-family: 'Roboto', sans-serif;
        }
    `]
})
export class ChipsFormComponent {
    @Input() items: ChipItem[] = [];
    @Input() displayField: string = 'displayText';
    @Input() maxVisibleItems: number = 4;
    @Input() verMasTexto: string = 'mantenedores.formularios.servicioTrabajo.verMas';
    @Input() verMenosTexto: string = 'mantenedores.formularios.servicioTrabajo.verMenos';

    // Clases CSS personalizables
    @Input() containerClass: string = 'bg-gray-50 p-3 rounded';
    @Input() chipClass: string = 'flex items-center gap-1 px-3 py-1.5 bg-[#e6e1dc] rounded text-sm';
    @Input() textClass: string = 'text-gray-600 font-normal';
    @Input() deleteButtonClass: string = 'ml-1.5 text-gray-500 hover:text-gray-700';

    @Output() itemDeleted = new EventEmitter<ChipItem>();
    @Output() itemsReordered = new EventEmitter<ChipItem[]>();

    mostrarTodos: boolean = false;

    onItemDelete(item: ChipItem): void {
        this.itemDeleted.emit(item);
    }

    onDrop(event: CdkDragDrop<ChipItem[]>): void {
        if (event.previousIndex === event.currentIndex) return;

        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
        this.itemsReordered.emit(this.items);
    }

    toggleMostrarTodos(): void {
        this.mostrarTodos = !this.mostrarTodos;
    }
} 