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
                    <div cdkDropList 
                         (cdkDropListDropped)="onDrop($event)" 
                         class="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg">
                        <div *ngFor="let item of items.slice(0, mostrarTodos ? undefined : maxVisibleItems); let i = index"
                            cdkDrag 
                            class="group inline-flex items-center h-[26px] px-2.5 bg-[#f3f0ed] rounded text-base font-roboto cursor-move">
                            <span class="text-[#4a4a4a]">{{ item[displayField] }}</span>
                            <button type="button" (click)="onItemDelete(item)"
                                class="ml-1.5 w-[18px] h-[18px] flex items-center justify-center bg-[#e0dad4] hover:bg-[#d3ccc4] rounded text-[#4a4a4a] text-lg leading-none">
                                ×
                            </button>
                        </div>
                    </div>
                    <div *ngIf="items.length > maxVisibleItems"
                        class="flex justify-end">
                        <button type="button"
                            class="flex items-center text-blue-600 cursor-pointer hover:text-blue-700"
                            (click)="toggleMostrarTodos()">
                            <mat-icon class="text-lg mr-1">{{ mostrarTodos ? 'remove' : 'add' }}</mat-icon>
                            <span class="text-lg font-roboto">{{ (mostrarTodos ? verMenosTexto : verMasTexto) | translate }}</span>
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

        .cdk-drag-preview {
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                        0 8px 10px 1px rgba(0, 0, 0, 0.14),
                        0 3px 14px 2px rgba(0, 0, 0, 0.12);
        }

        .cdk-drag-placeholder {
            opacity: 0;
        }

        .cdk-drag-animating {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
    `]
})
export class ChipsFormComponent {
    @Input() items: ChipItem[] = [];
    @Input() displayField: string = 'displayText';
    @Input() maxVisibleItems: number = 4;
    @Input() verMasTexto: string = 'mantenedores.formularios.servicioTrabajo.verMas';
    @Input() verMenosTexto: string = 'mantenedores.formularios.servicioTrabajo.verMenos';
    @Input() mostrarTodo: boolean = false;

    // Clases CSS personalizables
    @Input() containerClass: string = 'bg-gray-50 rounded-lg';

    @Output() itemDeleted = new EventEmitter<ChipItem>();
    @Output() itemsReordered = new EventEmitter<ChipItem[]>();

    mostrarTodos: boolean = false;

    ngOnInit() {
        if (this.mostrarTodo) {
            this.mostrarTodos = true;
        }
    }

    onItemDelete(item: ChipItem): void {
        this.itemDeleted.emit(item);
    }

    onDrop(event: CdkDragDrop<ChipItem[]>): void {
        if (event.previousIndex === event.currentIndex) return;

        moveItemInArray(this.items, event.previousIndex, event.currentIndex);

        // Actualizar el orden de los elementos
        this.items = this.items.map((item, index) => ({
            ...item,
            ordenEjecucionTrabajo: index + 1
        }));

        this.itemsReordered.emit(this.items);
    }

    toggleMostrarTodos(): void {
        this.mostrarTodos = !this.mostrarTodos;
    }
} 