import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Contacto } from "../../../../../core/models/contacto.model"

@Component({
  selector: "app-contacto-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./contacto.component.html",
  styleUrls: ["./contacto.component.css"],
})
export class ContactoComponent implements OnChanges {
  @Input() contacto: Contacto = {} as Contacto

  @Output() contactoChange = new EventEmitter<Contacto>()
  @Output() agregarContacto = new EventEmitter<Contacto>()

  contactoForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.contactoForm = this.createForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["contacto"] && this.contacto) {
      this.updateForm()
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ["", Validators.required],
      apellidoPaterno: ["", Validators.required],
      apellidoMaterno: [""],
      rut: ["", Validators.required],
      correoElectronico: ["", [Validators.required, Validators.email]],
      telefono: ["", Validators.required],
    })
  }

  updateForm(): void {
    this.contactoForm.patchValue({
      nombre: this.contacto.nombre,
      apellidoPaterno: this.contacto.apellidoPaterno,
      apellidoMaterno: this.contacto.apellidoMaterno,
      rut: this.contacto.rut,
      correoElectronico: this.contacto.email,
      telefonoMovil: this.contacto.telefonoMovil,
    })
  }

  onFormChange(): void {
    if (this.contactoForm.valid) {
      const contactoActualizado: Contacto = {
        ...this.contacto,
        ...this.contactoForm.value,
      }

      this.contactoChange.emit(contactoActualizado)
    }
  }

  onAgregarContacto(): void {
    if (this.contactoForm.valid) {
      const nuevoContacto: Contacto = {
        ...this.contacto,
        ...this.contactoForm.value,
      }

      this.agregarContacto.emit(nuevoContacto)
      this.contactoForm.reset()
    }
  }
}

