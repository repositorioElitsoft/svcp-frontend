import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface Contacto {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    rol: string;
    tipoDocumento: string;
    numeroDocumento: string;
    telefono: string;
    celular: string;
    correoElectronico: string;
    locaciones: Locacion[];
}

interface Locacion {
    id?: string;
    nombre?: string;
    direccion: string;
    rol: string;
}

@Component({
    selector: 'app-show-contacto-cliente',
    templateUrl: './show-contacto-cliente.html',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        TranslateModule
    ]
})
export class ShowContactoClienteComponent implements OnInit {
    @Input() contacto: Contacto | undefined;
    @Output() aceptarEvent = new EventEmitter<void>();
    @Output() editarContactoEvent = new EventEmitter<Contacto>();
    @Output() eliminarContactoEvent = new EventEmitter<Contacto>();
    @Output() editarLocacionEvent = new EventEmitter<{ contacto: Contacto, locacion: Locacion }>();
    @Output() eliminarLocacionEvent = new EventEmitter<{ contacto: Contacto, locacion: Locacion }>();
    @Output() agregarLocacionEvent = new EventEmitter<{ contacto: Contacto, locacion: Locacion }>();

    selectedFile: File | null = null;
    fileUrl: string | null = null;


    showLocaciones = false;
    nuevaLocalizacion: Locacion | null = null;
    nuevoRolLocalizacion = '';
    locacionesDisponibles: Locacion[] = [
        { direccion: 'Casita 4 - Av Italia 4890 - Santiago Centro', rol: '' },
        { direccion: 'Oficina Principal - Las Condes', rol: '' },
        { direccion: 'Sucursal Sur - Concepción', rol: '' }
    ];

    constructor() { }

    ngOnInit(): void {
        // Inicializar valores si es necesario
    }

    toggleLocaciones(): void {
        this.showLocaciones = !this.showLocaciones;
    }

    agregarLocalizacion(): void {
        // Reiniciar los valores del formulario de localización
        this.nuevaLocalizacion = null;
        this.nuevoRolLocalizacion = '';
    }

    guardarLocalizacion(): void {
        if (this.nuevaLocalizacion && this.nuevoRolLocalizacion && this.contacto) {
            const nuevaLoc = {
                ...this.nuevaLocalizacion,
                rol: this.nuevoRolLocalizacion
            };

            this.agregarLocacionEvent.emit({
                contacto: this.contacto,
                locacion: nuevaLoc
            });

            // Reiniciar formulario
            this.nuevaLocalizacion = null;
            this.nuevoRolLocalizacion = '';
        }
    }

    verLocacion(locacion: Locacion): void {
        // Implementar lógica para ver detalle de locación
        console.log('Ver locación:', locacion);
    }

    editarLocacion(locacion: Locacion): void {
        if (this.contacto) {
            this.editarLocacionEvent.emit({
                contacto: this.contacto,
                locacion
            });
        }
    }

    eliminarLocacion(locacion: Locacion): void {
        if (this.contacto) {
            this.eliminarLocacionEvent.emit({
                contacto: this.contacto,
                locacion
            });
        }
    }

    aceptar(): void {
        this.aceptarEvent.emit();
    }
}
