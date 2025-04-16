import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ZonaService } from '../../../../core/services/zona.service';
import { Zona } from '../../../../core/models/zona.model';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';

@Component({
    selector: 'app-busqueda-sector',
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
      <div class="flex flex-col md:flex-row items-center lg:items-end gap-4 p-4">
        <!-- Campo de búsqueda -->
        <div class="w-full md:w-auto">
          <div class="relative w-full md:w-[240px] lg:w-[300px]">
            <input [(ngModel)]="value" type="text"
              class="w-full h-[44px] px-4 py-2 rounded-lg border-2 border-[#C2C2C2] bg-white text-[#757575] text-lg outline-none"
              (ngModelChange)="onValueChange()"
              [placeholder]="('table.digiteBusqueda' | translate) + ' ' + ('mantenedores.sector.descripcionSector' | translate)" />
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2"
              [ngClass]="{'text-red-500': value, 'text-[#757575]': !value}" (click)="value ? clearInput() : null">
              <mat-icon>{{value ? 'close' : 'search'}}</mat-icon>
            </button>
          </div>
        </div>

        <!-- Select de filtros con espaciado para iPad Pro -->
        <div class="w-full md:w-auto self-end md:mx-4">
          <div class="relative w-full md:w-[160px] lg:w-[200px]">
            <mat-select [(ngModel)]="selectedFilter" (selectionChange)="onValueChange()"
              (opened)="onZonaSelectOpen()" [placeholder]="'mantenedores.sector.zona' | translate"
              class="block w-full h-[44px] px-4 py-2 text-lg text-[#757575] bg-white border-2 border-[#C2C2C2] rounded-lg appearance-none focus:outline-none focus:border-[#3f51b5]">
              <mat-option *ngFor="let option of filterOptions" [value]="option">
                {{ option.descripcionZona | translate }}
              </mat-option>
            </mat-select>
          </div>
        </div>

        <!-- Botón de búsqueda -->
        <button (click)="executeSearch()"
          class="w-full md:w-auto h-[44px] px-4 md:px-6 rounded-lg bg-[#3f51b5] text-white hover:bg-[#303f9f] transition-colors">
          {{ 'mantenedores.buscar' | translate }}
        </button>
      </div>
    </div>
  `,
})
export class BusquedaSectorComponent implements OnInit {
    @Input() field: string = '';
    @Input() value: string = '';
    @Input() filterOptions: any = [];
    @Input() isSimpleSearch: boolean = false;
    @Input() tableData: any[] = [];
    @Input() filters: any[] = [];
    @Input() filtersLabels: any[] = [];
    @Input() simpleSearchField: string = '';
    @Input() dataSource: any[] = [];
    @Input() showDiv: boolean = true;
    @Input() translationGroup = "";

    selectedFilter: any = {};
    zonaSelectAbierto: boolean = false;

    @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
    @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
    @Output() applyfilter = new EventEmitter<any>();
    @Output() filterDelete = new EventEmitter<string>();

    constructor(
        private translate: TranslateService,
        private zonaService: ZonaService
    ) { }

    ngOnInit() {
        this.cargarZonas();
    }

    private cargarZonas() {
        this.zonaService.buscarTodos().subscribe({
            next: (response: ApiEntityResponse<Zona[]>) => {
                if (response && response.data) {
                    this.filterOptions = response.data;
                    this.filterOptions.unshift({ id: null, descripcionZona: 'mantenedores.seleccion' });
                }
            },
            error: (error) => {
                console.error('Error al cargar las zonas:', error);
            }
        });
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
        console.log('selectedFilter:', this.selectedFilter);
        console.log('value:', this.value);

        const filter: any = {};
        const labels: any[] = [];

        if (this.value) {
            filter.descripcionSector = this.value;
            labels.push({ field: 'descripcionSector', value: this.value });
        }

        if (this.selectedFilter && this.selectedFilter.id) {
            filter.zona = this.selectedFilter.id;
            labels.push({ field: 'zona', value: this.selectedFilter.descripcionZona, id: this.selectedFilter.id });
        }

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

    clearInput() {
        this.value = '';
    }

    clearZona() {
        this.selectedFilter = this.filterOptions[0];
        this.executeSearch();
    }

    onZonaSelectOpen() {
        this.zonaSelectAbierto = true;
    }
}
