import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TituloDialogoComponent } from '../titulo-dialogo/titulo-dialogo.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
// Asegúrate de importar correctamente todos los servicios que utilices

@Component({
    selector: 'app-componente-form',
    standalone: true,
    template: `
    <app-titulo-dialogo
      [title]="esActualizar() ? 'mantenedores.formularios.role.tituloEditar' : 'mantenedores.formularios.role.tituloAgregar' | translate"
      icon="task"
      [ref]="dialogRef">
    </app-titulo-dialogo>

    <mat-dialog-content class="!p-0 dark:bg-neutral-800">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
        <!-- Campos del formulario -->
        <div class="grid grid-cols-2 gap-4 w-full">
          <button type="button" (click)="dialogRef.close()"
            class="text-lg elitsoft-warn w-full flex items-center justify-center py-2 text-center">
            {{ 'mantenedores.formularios.botonCancelar' | translate }}
          </button>
          <button type="submit" [disabled]="form.invalid"
            class="text-lg elitsoft-btn w-full flex items-center justify-center py-2 text-center disabled:opacity-50">
            {{ esActualizar() ? 'mantenedores.formularios.actualizar' : 'mantenedores.formularios.guardar' | translate }}
          </button>
        </div>
      </form>
    </mat-dialog-content>
  `,
    imports: [MatDialogModule, ReactiveFormsModule, TranslateModule, TituloDialogoComponent]
})
export class ComponenteFormComponent {
    form!: FormGroup;

    readonly dialogRef = inject(MatDialogRef<ComponenteFormComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private toastr: ToastrService
    ) {
        this.form = this.fb.group({
            id: [null],
            descripcion: [null, Validators.required],
        });
    }

    esActualizar(): boolean {
        return !!this.data?.esActualizar;
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
