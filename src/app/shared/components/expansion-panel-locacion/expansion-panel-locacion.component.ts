import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-expansion-panel-locacion',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './expansion-panel-locacion.component.html',
  styleUrl: './expansion-panel-locacion.component.css'
})
export class ExpansionPanelLocacionComponent {
  location = {
    name: 'Casita 4 • Santiago Centro',
    contacts: [
      {
        name: 'Juan Pérez',
        id: '23040635-9',
        phone: '+56957034447',
        email: 'Cathyrebopasjfrjf@gmail.com'
      },
      {
        name: 'Juan Pérez',
        id: '23040635-9',
        phone: '+56957034447',
        email: 'Cathyrebopasjfrjf@gmail.com'
      }
    ]
  };

  panelOpenState = false;
}