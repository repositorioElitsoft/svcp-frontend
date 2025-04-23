import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionClienteContratoComponent } from './seccion-cliente-contrato.component';

describe('SeccionClienteContratoComponent', () => {
  let component: SeccionClienteContratoComponent;
  let fixture: ComponentFixture<SeccionClienteContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionClienteContratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionClienteContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
