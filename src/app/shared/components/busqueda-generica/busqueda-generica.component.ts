import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-busqueda-generica',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        TranslateModule
    ],
    templateUrl: './busqueda-generica.component.html',
    styleUrls: ['./busqueda-generica.component.css']
})
export class BusquedaGenericaComponent implements OnInit {
    @Input() value: string = '';
    @Input() fieldName: string = ''; // Nombre del campo para buscar (ej. 'nombreRol', 'descripcionSector')
    @Input() fieldLabel: string = ''; // Label para mostrar en el placeholder
    @Input() translationPrefix: string = ''; // Prefijo para las traducciones (ej. 'mantenedores.role')
    @Input() translationFieldKey: string = ''; // Clave de traducción del campo (ej. 'nombreRol')
    @Input() placeholderTranslationKey: string = 'table.digiteBusqueda'; // Clave de traducción para el placeholder
    @Input() buttonText: string = 'Buscar'; // Texto del botón, puede ser traducido
    @Input() showSearchButton: boolean = true; // Mostrar u ocultar botón de búsqueda

    // Parámetros generales heredados del componente original
    @Input() isSimpleSearch: boolean = false;
    @Input() tableData: any[] = [];
    @Input() filters: any[] = [];
    @Input() filtersLabels: any[] = [];
    @Input() dataSource: any[] = [];
    @Input() showDiv: boolean = true;

    // Eventos
    @Output() valueChange = new EventEmitter<{ field: string; value: string }>();
    @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
    @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
    @Output() applyfilter = new EventEmitter<any>();
    @Output() filterDelete = new EventEmitter<string>();

    hasSearched: boolean = false;

    constructor(
        private translate: TranslateService
    ) { }

    ngOnInit() {
        // Inicialización del componente
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tableData']) {
            console.log('tableData recibida:', this.tableData);
        }
    }

    onValueChange() {
        console.log('onValueChange llamado, value:', this.value);
        if (this.isSimpleSearch) return;
        this.valueChange.emit({ field: this.fieldName, value: this.value });
    }

    executeSearch() {
        console.log('executeSearch llamado');
        console.log('fieldName:', this.fieldName);
        console.log('value:', this.value);

        this.hasSearched = this.value.length > 0;
        const filter: any = {};
        const labels: any[] = [];

        // Si hay un valor en el input de búsqueda
        if (this.value) {
            filter[this.fieldName] = this.value;
            labels.push({ field: this.fieldName, value: this.value });
        }

        // Siempre emitimos el filtro, incluso si está vacío
        console.log('Emitiendo filtro:', { filter, labels });
        this.applyfilter.emit({ filter, labels });
    }

    shouldShowSearch(): boolean {
        return true;
    }

    isKeyMissing(filter: any, key: string): boolean {
        return !Object.prototype.hasOwnProperty.call(filter, key);
    }

    makeSimpleSearch(values: any) {
        console.log('simple search activated ', values);
        this.applyfilter.emit(values);
    }

    deleteFilter(field: string) {
        this.filterDelete.emit(field);
    }

    filter() {
        console.log('Applying filters', this.filters);
        this.applyfilter.emit(this.filters);
    }

    getPlaceholderText(): string {
        const searchText = this.translate.instant(this.placeholderTranslationKey);
        const fieldText = this.fieldLabel ?
            this.translate.instant(this.fieldLabel) :
            (this.translationFieldKey && this.translationPrefix ?
                this.translate.instant(`${this.translationPrefix}.${this.translationFieldKey}`) :
                '');

        return fieldText ? `${searchText} ${fieldText}` : searchText;
    }

    clearValue() {
        this.value = '';
        this.hasSearched = false;
        const filter: any = {};
        const labels: any[] = [];
        this.applyfilter.emit({ filter, labels });
    }
} 