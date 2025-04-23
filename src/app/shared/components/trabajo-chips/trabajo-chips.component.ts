import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

interface TrabajoAsignado {
    id: number;
    trabajoId: number;
    descripcion: string;
    descripcionTrabajo: string;
    ordenEjecucionTrabajo: number;
}

@Component({
    selector: 'app-trabajo-chips',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        DragDropModule,
        TranslateModule
    ],
    template: `
        <div class="flex flex-col gap-2">
            <div class="bg-gray-50 p-3 rounded">
                <div class="flex justify-between items-start">
                    <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="flex flex-wrap gap-2 flex-1">
                        <div *ngFor="let trabajo of trabajosAsignados.slice(0, mostrarTodos ? undefined : 4); let i = index"
                            cdkDrag class="flex items-center gap-1 px-2 py-1 bg-[#e6e1dc] rounded text-sm">
                            <span class="text-gray-700">{{ trabajo.descripcionTrabajo }}</span>
                            <button type="button" (click)="onTrabajoDelete(trabajo)"
                                class="ml-1 text-gray-600 hover:text-gray-800">
                                ×
                            </button>
                        </div>
                    </div>
                    <div *ngIf="trabajosAsignados.length > 4"
                        class="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 ml-4"
                        (click)="toggleMostrarTodos()">
                        <mat-icon class="text-base mr-1">{{ mostrarTodos ? 'remove' : 'add' }}</mat-icon>
                        <span class="text-sm">{{ (mostrarTodos ? 'mantenedores.formularios.servicioTrabajo.verMenos' : 'mantenedores.formularios.servicioTrabajo.verMas') | translate }}</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TrabajoChipsComponent {
    @Input() trabajosAsignados: TrabajoAsignado[] = [];
    @Output() trabajoDeleted = new EventEmitter<TrabajoAsignado>();
    @Output() trabajosReordered = new EventEmitter<TrabajoAsignado[]>();

    mostrarTodos: boolean = false;

    onTrabajoDelete(trabajo: TrabajoAsignado): void {
        this.trabajoDeleted.emit(trabajo);
    }

    onDrop(event: CdkDragDrop<TrabajoAsignado[]>): void {
        if (event.previousIndex === event.currentIndex) return;

        moveItemInArray(this.trabajosAsignados, event.previousIndex, event.currentIndex);

        this.trabajosAsignados.forEach((trabajo, index) => {
            trabajo.ordenEjecucionTrabajo = index + 1;
        });

        this.trabajosReordered.emit(this.trabajosAsignados);
    }

    toggleMostrarTodos(): void {
        this.mostrarTodos = !this.mostrarTodos;
    }
} 