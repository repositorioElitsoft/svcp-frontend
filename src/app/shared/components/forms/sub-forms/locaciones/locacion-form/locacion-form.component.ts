import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { TipoDireccion } from "../../../../../../core/models/tipo-direccion.model"
import { Direccion } from "../../../../../../core/models/direccion.model"
import { Sector } from "../../../../../../core/models/sector.model"
import { Comuna } from "../../../../../../core/models/comuna.models"


@Component({
  selector: "app-locacion-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./locacion-form.component.html",
  styleUrls: ["./locacion-form.component.css"],
})
export class LocacionFormComponent implements OnChanges {
  @Input() direccion: Direccion = {} as Direccion
  @Input() comunas: Comuna[] = []
  @Input() sectores: Sector[] = []
  @Input() tiposDireccion: TipoDireccion[] = []

  @Output() direccionChange = new EventEmitter<Partial<Direccion>>()
  @Output() comunaChange = new EventEmitter<number>()

  locacionForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.locacionForm = this.createForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["direccion"] && this.direccion) {
      this.updateForm()
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      descripcionDireccion: ["", Validators.required],
      tipoDireccion: ["", Validators.required],
      comuna: ["", Validators.required],
      sector: [""],
      calle: ["", Validators.required],
      numeracion: ["", Validators.required],
      referencia: [""],
      solicitaEvidencia: [false],
    })
  }

  updateForm(): void {
    this.locacionForm.patchValue({
      descripcionDireccion: this.direccion.descripcionDireccion,
      tipoDireccion: this.direccion.tipoDireccion?.id,
      comuna: this.direccion.comuna?.id,
      sector: this.direccion.sector?.id,
      calle: this.direccion.calle,
      numeracion: this.direccion.numeracion,
      referencia: this.direccion.referencia,
      solicitaEvidencia: this.direccion.flagEvidencia === "S",
    })
  }

  onFormChange(): void {
    if (this.locacionForm.valid) {
      const formValues = this.locacionForm.value

      // Encontrar objetos completos basados en IDs
      const comunaSeleccionada = this.comunas.find((c) => c.id === formValues.comuna)
      const sectorSeleccionado = this.sectores.find((s) => s.id === formValues.sector)
      const tipoDireccionSeleccionado = this.tiposDireccion.find((t) => t.id === formValues.tipoDireccion)

      const direccionActualizada: Partial<Direccion> = {
        descripcionDireccion: formValues.descripcionDireccion,
        tipoDireccion: tipoDireccionSeleccionado,
        comuna: comunaSeleccionada,
        sector: sectorSeleccionado,
        calle: formValues.calle,
        numeracion: formValues.numeracion,
        referencia: formValues.referencia,
        flagEvidencia: formValues.solicitaEvidencia ? "S" : "N",
      }

      this.direccionChange.emit(direccionActualizada)
    }
  }

  onComunaChange(): void {
    const comunaId = this.locacionForm.get("comuna")?.value
    if (comunaId) {
      this.comunaChange.emit(comunaId)
      // Resetear el sector cuando cambia la comuna
      this.locacionForm.get("sector")?.setValue("")
    }
  }
}

