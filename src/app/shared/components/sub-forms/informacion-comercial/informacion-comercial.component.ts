import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { TipoClienteService } from '../../../../core/services/tipo-cliente.service';
import { AgrupacionComercialService } from '../../../../core/services/agrupacion-comercial.service';
import { SegmentacionClienteService } from '../../../../core/services/segmentacion-cliente.service';
import { TipoCliente } from '../../../../core/models/tipo-cliente.model';
import { AgrupacionComercial } from '../../../../core/models/agrupacion-comercial.model';
import { SegmentacionCliente } from '../../../../core/models/segmentacion-cliente.model';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';

@Component({
    selector: 'app-informacion-comercial',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatFormFieldModule,
        TranslateModule,
    ],
    templateUrl: './informacion-comercial.component.html',
    styleUrl: './informacion-comercial.component.css'
})
export class InformacionComercialComponent {
    form!: FormGroup;

    tiposClientes: TipoCliente[] = [];
    agrupacionesComerciales: AgrupacionComercial[] = [];
    segmentacionesClientes: SegmentacionCliente[] = [];
    valueToPatch: any;

    constructor(
        private fb: FormBuilder,
        private tipoClienteService: TipoClienteService,
        private agrupacionComercialService: AgrupacionComercialService,
        private segmentacionClienteService: SegmentacionClienteService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            tipoCliente: [null],
            agrupacionComercial: [null],
            segmentacionCliente: [null],
            campo1: [null],
            campo2: [null]
        });

        this.loadTiposClientes();
        this.loadAgrupacionesComerciales();
        this.loadSegmentacionesClientes();
    }

    private loadTiposClientes() {
        this.tipoClienteService.buscarTodos().subscribe({
            next: (response: ApiEntityResponse<TipoCliente[]>) => {
                this.tiposClientes = response.data;
                if (this.valueToPatch && this.valueToPatch.tipoCliente) {
                    const findTipoCliente = this.tiposClientes.find(e => e.id === this.valueToPatch.tipoCliente.id);
                    this.form.get("tipoCliente")?.setValue(findTipoCliente);
                }
            },
            error: (error) => {
                console.error('Error loading tipos clientes:', error);
            }
        });
    }

    private loadAgrupacionesComerciales() {
        this.agrupacionComercialService.buscarTodos().subscribe({
            next: (response: ApiEntityResponse<AgrupacionComercial[]>) => {
                this.agrupacionesComerciales = response.data;
                if (this.valueToPatch && this.valueToPatch.agrupacionComercial) {
                    const findAgrupacion = this.agrupacionesComerciales.find(e => e.id === this.valueToPatch.agrupacionComercial.id);
                    this.form.get("agrupacionComercial")?.setValue(findAgrupacion);
                }
            },
            error: (error) => {
                console.error('Error loading agrupaciones comerciales:', error);
            }
        });
    }

    private loadSegmentacionesClientes() {
        this.segmentacionClienteService.buscarTodos().subscribe({
            next: (segmentaciones: ApiEntityResponse<SegmentacionCliente[]>) => {
                this.segmentacionesClientes = segmentaciones.data;
                if (this.valueToPatch && this.valueToPatch.segmentacionCliente) {
                    const findSegmentacion = this.segmentacionesClientes.find(e => e.id === this.valueToPatch.segmentacionCliente.id);
                    this.form.get("segmentacionCliente")?.setValue(findSegmentacion);
                }
            },
            error: (error) => {
                console.error('Error loading segmentaciones clientes:', error);
            }
        });
    }

    patch(value: any) {
        this.form.patchValue(value);

        this.valueToPatch = value;
    }
} 