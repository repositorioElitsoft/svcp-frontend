import { Component, OnInit, inject, model} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClasificacionClienteService } from '../../core/services/clasificacion-cliente.service';
import { ClasificacionCliente } from '../../models/clasificacion-cliente.model';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,

} from '@angular/material/dialog';

/*modelsImports*/



@Component({
  selector: 'app-clasificacionCliente-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: `./clasificacion-cliente.component.html`,
  styles: []
})
export class ClasificacionClienteFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<ClasificacionClienteFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);
  

  constructor(
    private fb: FormBuilder,
    private clasificacionClienteService: ClasificacionClienteService,
    
    ) {
    this.form = this.fb.group({
        id: [null, Validators.required],
  descripcionClasificacionCliente: [null, Validators.required],
    });
  }

  ngOnInit(){
    

    if(this.esActualizar()){
      this.form.patchValue(this.data.object)
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if(!this.esActualizar()){
          this.clasificacionClienteService.crear(this.form.value as ClasificacionCliente).subscribe({
            next:(clasificacionCliente :ClasificacionCliente)=>{
                console.log("created entity ", clasificacionCliente)
            }
        })
      }

      if(this.esActualizar()){
        this.clasificacionClienteService.actualizar(this.form.value.id, this.form.value as ClasificacionCliente).subscribe({
          next:(clasificacionCliente :ClasificacionCliente)=>{
              console.log("updated entity ", clasificacionCliente)
          }
      })
    }
       
    }
  }
}