import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-direccion-ubicacion',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatError,
    MatLabel,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './direccion-ubicacion.component.html',
  styleUrl: './direccion-ubicacion.component.css'
})
export class DireccionUbicacionComponent {
  form!: FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      pais: [null, Validators.required],
      region: [null, Validators.required],
      ciudad: [null, Validators.required],
      provincia: [null, Validators.required],
      direccion: [null, Validators.required]
    })
  }
  patch(value: any) {
    this.form.patchValue(value)
  }
}
