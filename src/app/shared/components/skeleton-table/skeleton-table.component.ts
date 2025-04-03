import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skeleton-table.component.html',
    styleUrls: ['./skeleton-table.component.css']
})
export class SkeletonTableComponent {
    @Input() columns: number = 5; // Número de columnas a mostrar
    @Input() rows: number = 10; // Número de filas a mostrar
    @Input() showHeader: boolean = true; // Si se debe mostrar el encabezado
    @Input() showPagination: boolean = true; // Si se debe mostrar la paginación
    @Input() cellWidth: string = 'auto'; // Ancho de las celdas
    @Input() cellHeight: string = '1.25rem'; // Altura de las celdas
    @Input() headerHeight: string = '1.5rem'; // Altura del encabezado
    @Input() containerClass: string = ''; // Clases adicionales para el contenedor

    // Método para generar un array de números para iterar
    getArray(length: number): number[] {
        return Array(length).fill(0).map((_, index) => index);
    }
} 