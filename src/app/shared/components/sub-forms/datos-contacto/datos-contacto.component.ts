import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-datos-contacto',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatError,
    MatLabel,
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.css']
})
export class DatosContactoComponent {

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [null, Validators.required],
      telefonoFijo: [null, Validators.required],
      telefonoMovil: [null, Validators.required]
    });
  }

  patch(value: any) {
    this.form.patchValue(value);
  }
}
