import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../../titulo-dialogo/titulo-dialogo.component";
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@Component({
    selector: 'app-show-cliente',
    templateUrl: './show-cliente.component.html',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        TranslateModule,
        TituloDialogoComponent,
        MatProgressBarModule
    ]
})
export class ShowClienteComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<ShowClienteComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);


    fileUrl: string | null = null;
    cliente: any | undefined;
    showLocaciones = false;
    isLoadingImage = false;

    constructor(private clienteService: ClienteService) { }

    ngOnInit(): void {
        // Inicializar el cliente desde los datos del diálogo
        if (this.data && this.data.object) {
            this.cliente = this.data.object;
            console.log("show cliente: ", this.cliente);
        }

        // Activar el indicador de carga
        this.isLoadingImage = true;

        this.clienteService.descargarImagen(this.data.object.id).subscribe({
            next: (imagen: File) => {
                console.log("Imagen descargada:")
                this.fileUrl = URL.createObjectURL(imagen);
                this.isLoadingImage = false;
            },
            error: (error) => {
                console.error("Error al descargar la imagen:", error);
                this.isLoadingImage = false;
            }
        });
    }

    toggleLocaciones(): void {
        this.showLocaciones = !this.showLocaciones;
    }

    aceptar(): void {
        this.dialogRef.close(true);
    }
}
