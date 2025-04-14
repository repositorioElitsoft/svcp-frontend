import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { TipoDocumentoIdentificacion } from '../../../../core/models/tipo-documento-identificacion.model';
import { TipoDocumentoIdentificacionService } from '../../../../core/services/tipo-documento-identificacion.service';
import { EstadoService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estados.model';
import { ApiEntityResponse } from '../../../../core/models/api-entity-response.model';

@Component({
    selector: 'app-contactos-cliente-crear',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        TranslateModule,
        MatIconModule
    ],
    templateUrl: './contactos-cliente-crear.component.html'
})
export class ContactosClienteCrearComponent {
    form!: FormGroup;
    valueToPatch: any;
    tiposDocumentos: TipoDocumentoIdentificacion[] = [];
    estados: Estado[] = [];

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private estadoService: EstadoService,
        private tipoDocumentoIdentificacionesService: TipoDocumentoIdentificacionService
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            id: [null],
            nombre: [null, Validators.required],
            apellidoPaterno: [null, Validators.required],
            apellidoMaterno: [null, Validators.required],
            tipoDocumentoIdentificacion: [null, Validators.required],
            numeroDocumentoIdentificacion: [null, Validators.required],
            rol: [null, Validators.required],
            estado: [null, Validators.required],
            telefono: [null, Validators.required],
            celular: [null, Validators.required],
            correoElectronico: [null, [Validators.required, Validators.email]]
        });

        this.cargarTiposDocumentos();
        this.cargarEstados();
    }

    cargarEstados() {
        this.estadoService.buscarTodos().subscribe({
            next: (estados: ApiEntityResponse<Estado[]>) => {
                console.log('Estados cargados:', estados);
                this.estados = estados.data;
                if (this.valueToPatch && this.valueToPatch.estado) {
                    const findEstado = this.estados.find(e => e.id === this.valueToPatch.estado.id);
                    this.form.get("estado")?.setValue(findEstado);
                }
            },
            error: (error: any) => {
                console.error("Fallo al buscar estados ", error);
            }
        });
    }

    cargarTiposDocumentos() {
        this.tipoDocumentoIdentificacionesService.buscarTodos().subscribe({
            next: (tipos: ApiEntityResponse<TipoDocumentoIdentificacion[]>) => {
                console.log('Tipos de documentos cargados:', tipos);
                this.tiposDocumentos = tipos.data as any;
                if (this.valueToPatch && this.valueToPatch.documentoIdentificacion) {
                    const findTipoDocumento = this.tiposDocumentos.find(
                        e => e.id === this.valueToPatch.documentoIdentificacion.tipoDocumentoIdentificacion.id
                    );
                    this.form.get('numeroDocumentoIdentificacion')?.patchValue(this.getNumeroIdentificacion());
                    this.form.get("tipoDocumentoIdentificacion")?.setValue(findTipoDocumento);
                }
            },
            error: (error: any) => {
                console.error("Fallo al buscar tipos de documentos ", error);
            }
        });
    }

    getNumeroIdentificacion() {
        if (!this.valueToPatch || !this.valueToPatch.documentoIdentificacion) {
            return "";
        }

        // Verificar si el tipo de documento es RUT (ID = 1)
        if (this.valueToPatch.documentoIdentificacion.tipoDocumentoIdentificacion.id === 1) {
            const numero = this.valueToPatch.documentoIdentificacion.numero;
            const digitoVerificador = this.valueToPatch.documentoIdentificacion.digitoVerificador;

            // Formato RUT: numero-digitoVerificador
            return `${numero}-${digitoVerificador}`;
        }

        // Para otros tipos de documento, devolver solo el número
        return this.valueToPatch.documentoIdentificacion.numero;
    }

    patch(value: any) {
        this.form.patchValue(value);
        this.valueToPatch = value;

        // Recargar los datos para asegurarnos de que los selects se establezcan correctamente
        if (this.tiposDocumentos.length > 0 && value.documentoIdentificacion) {
            const findTipoDocumento = this.tiposDocumentos.find(
                e => e.id === value.documentoIdentificacion.tipoDocumentoIdentificacion.id
            );
            this.form.get('numeroDocumentoIdentificacion')?.patchValue(this.getNumeroIdentificacion());
            this.form.get("tipoDocumentoIdentificacion")?.setValue(findTipoDocumento);
        }

        if (this.estados.length > 0 && value.estado) {
            const findEstado = this.estados.find(e => e.id === value.estado.id);
            this.form.get("estado")?.setValue(findEstado);
        }
    }
}
