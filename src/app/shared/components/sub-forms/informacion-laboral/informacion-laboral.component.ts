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
  form!: FormGroup;

  estados: Estado[] = [];
  tiposEmpleados: TipoEmpleado[] = [];
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private tipoEmpleadoService: TipoEmpleadoService,
    private estadoService: EstadoService,
    private roleService: RoleService
  ) {
    this.form = this.fb.group({
      nombreUsuario: [null, Validators.required],
      estado: [null, Validators.required],
      tipoEmpleado: [null, Validators.required],
      contrasena: [null, Validators.required],
      role: [null, Validators.required]
    });
  }

  // Función para comparar objetos de tipo TipoEmpleado
  compareTipoEmpleado(t1: TipoEmpleado, t2: TipoEmpleado): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  // Función para comparar objetos de tipo Role
  compareRole(r1: Role, r2: Role): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  // Función para comparar objetos de tipo Estado
  compareEstado(e1: Estado, e2: Estado): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  // Método para asignar valores al formulario
  patch(value: any) {
    this.form.patchValue(value);
  }

  ngOnInit(): void {
    // Cargar roles
    this.roleService.buscarTodos().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        // Asignar valor inicial después de cargar los roles
        this.form.patchValue({
          role: this.roles.find(role => role.id === 1) // Cambia el ID según tu lógica
        });
      },
      error: (err) => {
        console.error("Error al obtener roles ", err);
      }
    });

    // Cargar estados
    this.estadoService.buscarTodos().subscribe({
      next: (estados: Estado[]) => {
        this.estados = estados;
        // Asignar valor inicial después de cargar los estados
        this.form.patchValue({
          estado: this.estados.find(estado => estado.id === 1) // Cambia el ID según tu lógica
        });
      },
      error: (err) => {
        console.error("Error al obtener estados ", err);
      }
    });

    // Cargar tipos de empleados
    this.tipoEmpleadoService.buscarTodos().subscribe({
      next: (tiposEmpleados: TipoEmpleado[]) => {
        this.tiposEmpleados = tiposEmpleados;
        // Asignar valor inicial después de cargar los tipos de empleados
        this.form.patchValue({
          tipoEmpleado: this.tiposEmpleados.find(tipo => tipo.id === 1) // Cambia el ID según tu lógica
        });
      },
      error: (err) => {
        console.error("Error al obtener tipos de empleados ", err);
      }
    });
  }
}