import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { TipoEmpleadoService } from '../../../../core/services/tipo-empleado.service';
import { EstadoService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estados.model';
import { TipoEmpleado } from '../../../../core/models/tipo-empleado.model';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/models/role.model';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './informacion-laboral.component.html',
  styleUrl: './informacion-laboral.component.css'
})
export class InformacionLaboralComponent implements OnInit {
  form!: FormGroup

  estados: Estado[] = []
  tiposEmpleados: TipoEmpleado[] = []
  roles: Role[] = []
  constructor(private fb: FormBuilder,
    private tipoEmpleadoService: TipoEmpleadoService,
    private estadoService: EstadoService,
    private roleService: RoleService

  ) {
    this.form = this.fb.group({
      nombreUsuario: [null, Validators.required],
      estado: [{}, Validators.required],
      tipoEmpleado: [{}, Validators.required],
      contrasena: [{}, Validators.required],
      role: [{}, Validators.required]
    })
  }

  patch(value: any) {
    this.form.patchValue(value)
  }

  ngOnInit(): void {
    this.roleService.buscarTodos().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error("Error at getting estados ", err);
      }
    });

    this.estadoService.buscarTodos().subscribe({
      next: (estados: Estado[]) => {
        this.estados = estados;
      },
      error: (err) => {
        console.error("Error at getting estados ", err);
      }
    });

    this.tipoEmpleadoService.buscarTodos().subscribe({
      next: (tiposEmpleados: TipoEmpleado[]) => {
        console.log("Tipos de Empleados recibidos:", tiposEmpleados);
        this.tiposEmpleados = tiposEmpleados;
      },
      error: (err) => {
        console.error("Error at getting tiposEmpleados ", err);
      }
    });
  }


}
