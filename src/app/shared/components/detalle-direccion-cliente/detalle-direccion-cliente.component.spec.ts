import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDireccionClienteComponent } from './detalle-direccion-cliente.component';

describe('DetalleDireccionClienteComponent', () => {
  let component: DetalleDireccionClienteComponent;
  let fixture: ComponentFixture<DetalleDireccionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleDireccionClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleDireccionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
