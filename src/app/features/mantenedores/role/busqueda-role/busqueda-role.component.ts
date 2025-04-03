import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';

@Component({
    selector: 'app-busqueda-role',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        TranslateModule
    ],
    templateUrl: './busqueda-role.component.html',
    styleUrls: ['./busqueda-role.component.css']
})
export class BusquedaRoleComponent implements OnInit {
    @Input() field: string = '';
    @Input() value: string = '';
    @Input() isSimpleSearch: boolean = false;
    @Input() tableData: any[] = [];
    @Input() filters: any[] = [];
    @Input() filtersLabels: any[] = [];
    @Input() simpleSearchField: string = '';
    @Input() dataSource: any[] = [];
    @Input() showDiv: boolean = true;
    @Input() translationGroup = "";

    @Output() valueChange = new EventEmitter<{ field: string; value: string }>();
    @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
    @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
    @Output() applyfilter = new EventEmitter<any>();
    @Output() filterDelete = new EventEmitter<string>();

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
        this.valueChange.emit({ field: this.field, value: this.value });
    }

    executeSearch() {
        console.log('executeSearch llamado');
        console.log('value:', this.value);

        const filter: any = {};
        const labels: any[] = [];

        // Si hay un valor en el input de búsqueda
        if (this.value) {
            filter.nombreRol = this.value;
            labels.push({ field: 'nombreRol', value: this.value });
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

    protected getTranslationGroup(column: string) {
        return this.translationGroup ? `${this.translationGroup}.${column}` : column;
    }

    clearValue() {
        this.value = '';
        this.executeSearch();
    }
} 