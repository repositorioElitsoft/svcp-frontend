import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TipoServicioService } from '../../../../core/services/tipo-servicio.service';
import { EstadoService } from '../../../../core/services/estado.service';

@Component({
    selector: 'app-busqueda-servicio',
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
                        class="w-full h-[44px] px-4 py-2 rounded-lg border-2 border-[#C2C2C2] bg-white text-[#757575] text-lg outline-none focus:border-[#3f51b5]"
                        (ngModelChange)="onValueChange()"
                        [placeholder]="('table.digiteBusqueda' | translate) + ' ' + ('mantenedores.servicio.descripcion' | translate)" />
                    <button class="absolute right-3 top-1/2 transform -translate-y-1/2"
                        [ngClass]="{'text-red-500': value, 'text-[#757575]': !value}" 
                        (click)="value ? clearInput() : null">
                        <mat-icon>{{value ? 'close' : 'search'}}</mat-icon>
                    </button>
                </div>
            </div>

            <!-- Select de Tipo Servicio -->
            <div class="w-full md:w-auto self-end md:mx-4">
                <div class="relative w-full md:w-[160px] lg:w-[200px]">
                    <mat-select [(ngModel)]="selectedTipoServicio" (selectionChange)="onValueChange()"
                        [placeholder]="'mantenedores.servicio.tipoServicio' | translate"
                        class="block w-full h-[44px] px-4 py-2 text-lg text-[#757575] bg-white border-2 border-[#C2C2C2] rounded-lg appearance-none focus:outline-none focus:border-[#3f51b5]">
                        <mat-option [value]="null">{{ 'mantenedores.seleccion' | translate }}</mat-option>
                        <mat-option *ngFor="let tipo of tiposServicio" [value]="tipo">
                            {{ tipo.descripcionTipoServicio }}
                        </mat-option>
                    </mat-select>
                </div>
            </div>

            <!-- Select de Estado -->
            <div class="w-full md:w-auto self-end">
                <div class="relative w-full md:w-[160px] lg:w-[200px]">
                    <mat-select [(ngModel)]="selectedEstado" (selectionChange)="onValueChange()"
                        [placeholder]="'mantenedores.servicio.estado' | translate"
                        class="block w-full h-[44px] px-4 py-2 text-lg text-[#757575] bg-white border-2 border-[#C2C2C2] rounded-lg appearance-none focus:outline-none focus:border-[#3f51b5]">
                        <mat-option [value]="null">{{ 'mantenedores.seleccion' | translate }}</mat-option>
                        <mat-option *ngFor="let estado of estados" [value]="estado">
                            {{ estado.descripcion }}
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
    `
})
export class BusquedaServicioComponent implements OnInit {
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

    selectedTipoServicio: any = null;
    selectedEstado: any = null;
    tiposServicio: any[] = [];
    estados: any[] = [];

    @Output() simpleSearch = new EventEmitter<{ [x: string]: string }>();
    @Output() filterSearch = new EventEmitter<{ filter: string; value: string }>();
    @Output() applyfilter = new EventEmitter<any>();
    @Output() filterDelete = new EventEmitter<string>();

    constructor(
        private translate: TranslateService,
        private tipoServicioService: TipoServicioService,
        private estadoService: EstadoService
    ) { }

    ngOnInit() {
        this.cargarTiposServicio();
        this.cargarEstados();
    }

    private cargarTiposServicio() {
        this.tipoServicioService.buscarTodos().subscribe({
            next: (response: any) => {
                if (response && response.data) {
                    this.tiposServicio = response.data;
                }
            },
            error: (error) => {
                console.error('Error al cargar tipos de servicio:', error);
            }
        });
    }

    private cargarEstados() {
        this.estadoService.buscarTodos().subscribe({
            next: (response: any) => {
                if (response && response.data) {
                    this.estados = response.data;
                }
            },
            error: (error) => {
                console.error('Error al cargar estados:', error);
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
        console.log('selectedTipoServicio:', this.selectedTipoServicio);
        console.log('selectedEstado:', this.selectedEstado);
        console.log('value:', this.value);

        const filter: any = {};
        const labels: any[] = [];

        if (this.value) {
            filter.descripcion = this.value;
            labels.push({ field: 'descripcion', value: this.value });
        }

        if (this.selectedTipoServicio) {
            filter.tipoServicio = this.selectedTipoServicio.id;
            labels.push({
                field: 'tipoServicio',
                value: this.selectedTipoServicio.descripcionTipoServicio,
                id: this.selectedTipoServicio.id
            });
        }

        if (this.selectedEstado) {
            filter.estado = this.selectedEstado.id;
            labels.push({
                field: 'estado',
                value: this.selectedEstado.descripcion,
                id: this.selectedEstado.id
            });
        }

        console.log('Emitiendo filtro:', { filter, labels });
        this.applyfilter.emit({ filter, labels });
    }

    clearInput() {
        this.value = '';
        // No ejecutar búsqueda aquí, solo limpiar el campo
    }

    clearTipoServicio() {
        this.selectedTipoServicio = null;
        this.executeSearch();
    }

    clearEstado() {
        this.selectedEstado = null;
        this.executeSearch();
    }
}
