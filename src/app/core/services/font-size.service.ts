import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FontSizeService {
    private readonly validFontSizes = ['-4px', '0px', '12px']; // Tamaños válidos en píxeles
    fontSizes = [
        { value: '-4px', label: 'A-' },
        { value: '0px', label: 'A' },
        { value: '12px', label: 'A+' },
    ];
    selectedFontSize = localStorage.getItem('appFontSize') || '0px'; // Valor predeterminado de tamaño

    constructor() {
        this.loadFontSizeFromLocalStorage();
    }

    /**
     * Cambia el tamaño de la fuente y lo guarda en localStorage.
     * @param newSize El nuevo tamaño de la fuente en píxeles.
     */
    onFontSizeChange(newSize: string): void {
        if (this.validFontSizes.includes(newSize)) {
            localStorage.setItem('appFontSize', newSize);
            document.documentElement.style.setProperty('--base-font-size', newSize);
            console.log('Nuevo tamaño de fuente:', getComputedStyle(document.documentElement).getPropertyValue('--base-font-size'));
        } else {
            console.warn('Tamaño de fuente no válido:', newSize);
        }
    }

    /**
     * Carga el tamaño de la fuente desde localStorage y lo aplica.
     */
    private loadFontSizeFromLocalStorage(): void {
        const savedFontSize = localStorage.getItem('appFontSize') || '0px'; // Valor predeterminado
        const fontSizeToUse = this.validFontSizes.includes(savedFontSize) ? savedFontSize : '0px';
        this.selectedFontSize = fontSizeToUse; // Asignar el tamaño de fuente cargado
        document.documentElement.style.setProperty('--base-font-size', fontSizeToUse);
    }

    /**
     * Obtiene el tamaño de fuente seleccionado actualmente.
     */
    getSelectedFontSize(): string {
        return this.selectedFontSize;
    }

    /**
     * Obtiene los posibles tamaños de fuente disponibles.
     */
    getFontSizes(): { value: string, label: string }[] {
        return this.fontSizes;
    }
}
