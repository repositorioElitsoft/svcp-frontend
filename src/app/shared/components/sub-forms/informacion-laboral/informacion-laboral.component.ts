import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { TipoEmpleadoService } from '../../../../core/services/tipo-empleado.service';
import { EstadoService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estado.model';
import { TipoEmpleado } from '../../../../core/models/tipo-empleado.model';

@Component({
  selector: 'app-informacion-laboral',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatError,
    MatLabel,
    TranslateModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  templateUrl: './informacion-laboral.component.html',
  styleUrl: './informacion-laboral.component.css'
})
export class InformacionLaboralComponent implements OnInit {
  form!: FormGroup

  estados: Estado[] = []
  tiposEmpleados: TipoEmpleado[] = []

  constructor(private fb: FormBuilder,
    private tipoEmpleadoService: TipoEmpleadoService,
    private estadoService: EstadoService,

  ) {
    this.form = this.fb.group({
      nombreUsuario: [null, Validators.required],
      estado: [{}, Validators.required],
      tipoEmpleado: [{}, Validators.required],
      contrasena: [{}, Validators.required],
      rol: [null, Validators.required]
    })
  }

  patch(value: any) {
    this.form.patchValue(value)
  }

  ngOnInit(): void {
    this.estadoService.buscarTodos().subscribe({
      next: (estados: Estado[]) => {
        this.estados = estados
      },
      error: (err) => {
        console.error("Error at getting estados ", err)
      }
    })
    this.tipoEmpleadoService.buscarTodos().subscribe({
      next: (tiposEmpleados: TipoEmpleado[]) => {
        this.tiposEmpleados = tiposEmpleados
      },
      error: (err) => {
        console.error("Error at getting tiposEmpleados ", err)
      }
    })
  }


}
