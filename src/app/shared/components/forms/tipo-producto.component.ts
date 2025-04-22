import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoProductoService } from '../../../core/services/tipo-producto.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { convertErrorMessageToI18 } from '../../../core/utils/errors.utils';
import { TipoProductoTipoComponente } from '../../../core/models/tipo-producto-tipo.componente.model';
import { TipoComponente } from '../../../core/models/tipo-componente.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component";
import { TipoProducto } from '../../../core/models/tipo-producto.model';
import { catchError, tap, throwError, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TipoComponenteService } from '../../../core/services/tipo-componente.service';
import { TipoProductoTipoComponenteService } from '../../../core/services/tipo-producto-tipo-componente.service';
import { TipoComponenteAsignacionComponent } from '../tipo-componente-asignacion/tipo-componente-asignacion.component';

@Component({
  selector: 'app-tipo-producto-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    MatSelectModule,
    MatOptionModule,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule,
    TituloDialogoComponent,
    TipoComponenteAsignacionComponent,
  ],
  templateUrl: `./tipo-producto.component.html`,
  styles: [],
})
export class TipoProductoFormComponent implements OnInit {
  form!: FormGroup;
  tiposComponentes: TipoComponente[] = [];
  tiposComponente: string[] = ['Tipo 1', 'Tipo 2', 'Tipo 3']; // Esto debe ser reemplazado con los tipos reales

  readonly dialogRef = inject(MatDialogRef<TipoProductoFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  constructor(
    private fb: FormBuilder,
    private tipoProductoService: TipoProductoService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private tipoComponenteService: TipoComponenteService,
    private tipoProductoTipoComponenteService: TipoProductoTipoComponenteService
  ) {
    this.form = this.fb.group({
      id: [null],
      descripcionTipoProducto: [null, Validators.required],
      tipoComponenteId: [null],
      tipoProductoTipoComponentes: [[]]
    });
  }

  ngOnInit() {
    this.cargarTiposComponentes();

    if (this.esActualizar() && this.data?.object) {
      this.form.patchValue({
        id: this.data.object.id,
        descripcionTipoProducto: '',
        tipoProductoTipoComponentes: this.data.object.tipoProductoTipoComponentes || []
      });
    }

    // Suscribirse a los cambios del select de tipo componente
    this.form.get('tipoComponenteId')?.valueChanges.subscribe(tipoComponenteId => {
      if (tipoComponenteId) {
        this.agregarTipoComponente(tipoComponenteId);
        // Resetear la selección para permitir seleccionar el mismo tipo nuevamente si se elimina
        setTimeout(() => {
          this.form.patchValue({ tipoComponenteId: null }, { emitEvent: false });
        });
      }
    });
  }

  cargarTiposComponentes() {
    this.tipoComponenteService.buscarTodos().subscribe({
      next: (response) => {
        this.tiposComponentes = response.data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de componentes:', error);
        this.toastr.error(this.translate.instant('mantenedores.formularios.error.cargarTiposComponentes'));
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const tipoProducto: TipoProducto = {
        id: this.form.value.id,
        descripcionTipoProducto: this.form.value.descripcionTipoProducto,
        tipoProductoTipoComponentes: []
      };

      if (this.esActualizar()) {
        // Primero actualizamos el tipo producto
        this.tipoProductoService.actualizar(tipoProducto.id!, tipoProducto).subscribe({
          next: (response: any) => {
            // Obtenemos las relaciones actuales para eliminarlas
            const relacionesActuales = this.data.object.tipoProductoTipoComponentes || [];
            const deleteObservables = relacionesActuales.map((relacion: TipoProductoTipoComponente) =>
              this.tipoProductoTipoComponenteService.borrar(tipoProducto.id!, relacion.tipoComponente.id!)
            );

            // Si no hay relaciones a eliminar, procedemos a crear las nuevas
            if (deleteObservables.length === 0) {
              this.crearRelacionesComponentes(tipoProducto.id!);
              return;
            }

            // Eliminamos las relaciones antiguas y luego creamos las nuevas
            forkJoin(deleteObservables).subscribe({
              next: () => {
                this.crearRelacionesComponentes(tipoProducto.id!);
              },
              error: (error) => {
                const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
                this.toastr.error(errorMessage);
              }
            });
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
            this.toastr.error(errorMessage);
          }
        });
      } else {
        this.tipoProductoService.crear(tipoProducto).subscribe({
          next: (response: any) => {
            this.crearRelacionesComponentes(response.data.id);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant(convertErrorMessageToI18(error.message));
            this.toastr.error(errorMessage);
          }
        });
      }
    }
  }

  private crearRelacionesComponentes(tipoProductoId: number) {
    const componentesActuales = this.form.value.tipoProductoTipoComponentes || [];
    if (componentesActuales.length === 0) {
      this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
      this.dialogRef.close(true);
      return;
    }

    const observables = componentesActuales.map((componente: TipoProductoTipoComponente) => {
      const relacion: TipoProductoTipoComponente = {
        tipoProducto: {
          id: tipoProductoId,
          descripcionTipoProducto: this.form.value.descripcionTipoProducto
        },
        tipoComponente: {
          id: componente.tipoComponente.id,
          nombre: componente.tipoComponente.nombre,
          descripcion: componente.tipoComponente.descripcion
        },
        cantidad: componente.cantidad
      };
      return this.tipoProductoTipoComponenteService.crear(relacion);
    });

    forkJoin(observables).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('alertas.toastr.guardar.success'));
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
        this.toastr.error(errorMessage);
      }
    });
  }

  get tipoComponenteControl() {
    return this.form.get('tipoComponente');
  }

  get cantidadControl() {
    return this.form.get('cantidad');
  }

  agregarTipoComponente(tipoComponenteId: number) {
    const tipoComponente = this.tiposComponentes.find(t => t.id === tipoComponenteId);
    const componentesActuales = this.form.get('tipoProductoTipoComponentes')?.value || [];

    // Verificar si ya existe
    if (tipoComponente && !componentesActuales.some((c: TipoProductoTipoComponente) => c.tipoComponente.id === tipoComponenteId)) {
      const nuevoComponente: TipoProductoTipoComponente = {
        tipoComponente: tipoComponente,
        cantidad: 1,
        tipoProducto: {
          id: this.form.get('id')?.value,
          descripcionTipoProducto: this.form.get('descripcionTipoProducto')?.value
        }
      };

      this.form.patchValue({
        tipoProductoTipoComponentes: [...componentesActuales, nuevoComponente]
      });
    }
  }

  get tiposComponentesDisponibles() {
    const componentesActuales = this.form.get('tipoProductoTipoComponentes')?.value || [];
    const idsSeleccionados = new Set(componentesActuales.map((c: TipoProductoTipoComponente) => c.tipoComponente.id));
    return this.tiposComponentes.filter(t => !idsSeleccionados.has(t.id));
  }

  eliminarTipoComponente(item: TipoProductoTipoComponente) {
    const componentesActuales = this.form.get('tipoProductoTipoComponentes')?.value || [];
    const nuevosComponentes = componentesActuales.filter(
      (comp: TipoProductoTipoComponente) => comp.tipoComponente.id !== item.tipoComponente.id
    );
    this.form.patchValue({
      tipoProductoTipoComponentes: nuevosComponentes
    });
  }

  actualizarCantidad(event: { item: TipoProductoTipoComponente, cantidad: number }) {
    const componentesActuales = this.form.get('tipoProductoTipoComponentes')?.value || [];
    const nuevosComponentes = componentesActuales.map((comp: TipoProductoTipoComponente) => {
      if (comp.tipoComponente.id === event.item.tipoComponente.id) {
        return { ...comp, cantidad: event.cantidad };
      }
      return comp;
    });
    this.form.patchValue({
      tipoProductoTipoComponentes: nuevosComponentes
    });
  }
}