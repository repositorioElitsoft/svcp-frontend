import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { TipoComponenteAsignacionComponent } from '../tipo-componente-asignacion/tipo-componente-asignacion.component';
import { TipoProducto } from '../../../core/models/tipo-producto.model';
import { TipoProductoService } from '../../../core/services/tipo-producto.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-tipo-producto-view',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatIconModule,
        TranslateModule,
        TituloDialogoComponent,
        TipoComponenteAsignacionComponent
    ],
    template: `
    <app-titulo-dialogo
      [title]="'mantenedores.formularios.tipoProducto.tituloDetalle' | translate"
      icon="task"
      [ref]="dialogRef">
    </app-titulo-dialogo>

    <mat-dialog-content class="!p-0 dark:bg-neutral-800">
      <div class="p-6 space-y-4">
        <!-- Título y botón de editar -->
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-medium">{{'mantenedores.tipoProducto.descripcionTipoProducto' | translate}}</h2>
          <button mat-icon-button class="text-green-500">
            <mat-icon>edit</mat-icon>
          </button>
        </div>

        <!-- Descripción del tipo de producto -->
        <div class="text-lg text-gray-600">
          {{tipoProducto?.descripcionTipoProducto}}
        </div>

        <!-- Título de tipos de componentes -->
        <h3 class="text-xl font-medium mt-6">{{'mantenedores.tipoProducto.tipoProductoTipoComponentes' | translate}}</h3>

        <!-- Lista de componentes -->
        <div class="space-y-2">
          <ng-container *ngFor="let componente of tipoProducto?.tipoProductoTipoComponentes">
            <div class="flex items-center">
              <span class="text-lg">{{componente.tipoComponente.nombre}} ({{componente.cantidad}})</span>
            </div>
          </ng-container>
        </div>

        <!-- Botón de aceptar -->
        <div class="mt-6">
          <button 
            (click)="dialogRef.close()"
            class="text-lg elitsoft-warn w-full flex items-center justify-center py-2 text-center">
            Aceptar
          </button>
        </div>
      </div>
    </mat-dialog-content>
  `,
    styles: [`
    :host {
      display: block;
    }
    .mat-dialog-content {
      max-height: none;
    }
  `]
})
export class TipoProductoViewComponent {
    form: FormGroup;
    tipoProducto?: TipoProducto;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TipoProductoViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { object: number },
        private tipoProductoService: TipoProductoService
    ) {
        console.log('Data recibida del padre:', this.data);
        this.form = this.fb.group({
            descripcionTipoProducto: [{ value: '', disabled: true }],
            tipoComponenteId: [{ value: '', disabled: true }]
        });

        this.cargarDatos();
    }

    async cargarDatos() {
        try {
            const params = {
                id: this.data.object,
                pageNumber: 0,
                pageSize: 1,
                sortField: 'descripcionTipoProducto',
                sortDirection: 'ASC'
            };

            console.log('Parámetros enviados al servicio:', params);
            const response = await firstValueFrom(this.tipoProductoService.buscarFiltradoAsignacion(params));
            console.log('Respuesta del servicio:', response);

            if (response.content && response.content.length > 0) {
                this.tipoProducto = response.content[0];
                console.log('Tipo producto cargado:', this.tipoProducto);
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }
}
