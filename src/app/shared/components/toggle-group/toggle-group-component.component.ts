import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToggleOption {
    value: any;
    label: string;
}

@Component({
    selector: 'app-toggle-group',
    standalone: true, // ← Indica que es un componente standalone
    imports: [CommonModule], // ← Importa CommonModule para usar ngClass
    template: `<div class="flex bg-white  overflow-hidden">
  <button *ngFor="let option of options" (click)="onSelect(option.value)" [ngClass]="[
        'flex-1 h-11 text-lg transition-colors font-medium',
        selectedValue === option.value 
          ? selectedClass 
          : unselectedClass,
        hoverClass
      ]">
    {{ option.label }}
  </button>
</div>`
})
export class ToggleGroupComponent {
    @Input() options: ToggleOption[] = [];
    @Input() selectedValue: any;
    @Input() selectedClass = 'bg-servicampo text-white';
    @Input() unselectedClass = 'bg-white dark:bg-neutral-800 text-[#9e9e9e]';
    @Input() hoverClass = 'hover:bg-gray-100';

    @Output() valueChange = new EventEmitter<any>();

    onSelect(value: any) {
        this.selectedValue = value;
        this.valueChange.emit(value);
    }
}
