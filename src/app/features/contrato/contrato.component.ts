import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FiltrosContratoComponent } from './shared/filtros-contrato/filtros-contrato.component';
import { LocacionComponent } from './shared/locacion/locacion.component';
import { ClienteContratoComponent } from '../../cliente-contrato/cliente-contrato.component';

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [MatIcon, TranslateModule, FiltrosContratoComponent, LocacionComponent, ClienteContratoComponent],
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css'] // Corregido de 'styleUrl' a 'styleUrls'
})
export class ContratoComponent implements OnInit {
  titulo: string = 'Gestion de Contrato'; // Puedes cambiarlo dinámicamente

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }



  volver() {
    this.router.navigate(['/portal/home']);
  }
}
