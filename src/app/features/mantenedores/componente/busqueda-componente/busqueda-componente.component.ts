import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-busqueda-componente',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        CommonModule,
        TranslateModule
    ],
    template: `
    <div class="">
        <div class="flex flex-col xl:flex-row items-start xl:items-end gap-4 p-4">
            <div class="flex flex-col sm:flex-row xl:flex-row items-start gap-4 w-full xl:w-auto">
                <!-- Campo de búsqueda -->
                <div class="w-full sm:flex-1 xl:w-[300px]">
                    <div class="relative w-full">
                        <input [(ngModel)]="value" type="text"
                            class="w-full h-[44px] px-4 py-2 rounded-lg border-2 border-[#C2C2C2] bg-white text-[#757575] text-lg outline-none focus:border-[#3f51b5]"
                            (ngModelChange)="onValueChange()"
                            [placeholder]="('table.digiteBusqueda' | translate) + ' ' + ('mantenedores.componente.descripcionComponente' | translate)" />
                        <button class="absolute right-3 top-1/2 transform -translate-y-1/2"
                            [ngClass]="{'text-red-500': value, 'text-[#757575]': !value}" 
                            (click)="value ? clearInput() : null">
                            <mat-icon>{{value ? 'close' : 'search'}}</mat-icon>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Botón de búsqueda -->
            <div class="w-full sm:flex sm:justify-end xl:w-auto">
                <button (click)="executeSearch()"
                    class="w-full sm:w-[140px] h-[44px] px-4 rounded-lg bg-[#3f51b5] text-white hover:bg-[#303f9f] transition-colors">
                    {{ 'mantenedores.buscar' | translate }}
                </button>
            </div>
        </div>
    </div>
    `
})
export class BusquedaComponenteComponent implements OnInit {
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

    @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
    @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
    @Output() applyfilter = new EventEmitter<any>();
    @Output() filterDelete = new EventEmitter<string>();

    constructor(
        private translate: TranslateService
    ) { }

    ngOnInit() {
        // Inicialización si es necesaria
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tableData']) {
            console.log('tableData recibida:', this.tableData);
        }
    }

    onValueChange() {
        console.log('onValueChange llamado, value:', this.value);
        if (this.isSimpleSearch) return;
    }

    executeSearch() {
        console.log('executeSearch llamado');
        console.log('value:', this.value);

        const filter: any = {};
        const labels: any[] = [];

        if (this.value) {
            filter.descripcion = this.value;
            labels.push({ field: 'descripcion', value: this.value });
        }

        console.log('Emitiendo filtro:', { filter, labels });
        this.applyfilter.emit({ filter, labels });
    }

    clearInput() {
        this.value = '';
        // No ejecutar búsqueda aquí, solo limpiar el campo
    }
} 