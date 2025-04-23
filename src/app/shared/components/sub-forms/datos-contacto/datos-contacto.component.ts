import { Component, ChangeDetectorRef } from '@angular/core';
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
  valueToPatch: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.required],
      telefonoFijo: [null, Validators.required],
      telefonoMovil: [null, Validators.required]
    });
  }

  patch(value: any) {
    this.form.patchValue({
      email: value.email,
      telefonoFijo: value.telefonoFijo,
      telefonoMovil: value.telefonoMovil
    });

    this.valueToPatch = value;
  }
}
