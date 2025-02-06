import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ToggleOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-toggle-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex bg-white overflow-hidden">
      <button 
        *ngFor="let option of options" 
        (click)="onSelect(option.value)" 
        [ngClass]="[
          'flex-1 h-11 text-lg transition-colors font-medium',
          selectedValue === option.value 
            ? selectedClass 
            : unselectedClass,
          hoverClass
        ]">
        {{ option.label }}
      </button>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleGroupComponent),
      multi: true,
    },
  ],
})
export class ToggleGroupComponent implements ControlValueAccessor {
  @Input() options: ToggleOption[] = [];
  @Input() selectedClass = 'bg-servicampo text-white';
  @Input() unselectedClass = 'bg-white dark:bg-neutral-800 text-[#9e9e9e]';
  @Input() hoverClass = 'hover:bg-gray-100';

  // Valor interno del componente que se sincronizará con el modelo
  selectedValue: any;

  @Output() valueChange = new EventEmitter<any>();

  // Callbacks que Angular nos proporciona
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  // Método para manejar la selección de una opción
  onSelect(value: any) {
    this.selectedValue = value;
    // Notifica a Angular el cambio de valor
    this.onChange(value);
    // Emite el cambio para otros componentes que puedan estar escuchando
    this.valueChange.emit(value);
    // Marca el componente como "tocado"
    this.onTouched();
  }

  // Método que Angular llama para escribir un valor en el componente
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  // Registra la función que se llamará cuando el valor cambie
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Registra la función que se llamará cuando el componente sea tocado
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Opcional: si necesitas manejar el estado deshabilitado del componente
  setDisabledState?(isDisabled: boolean): void {
    // Aquí podrías, por ejemplo, agregar una clase para mostrar el estado deshabilitado o evitar clicks
  }
}
