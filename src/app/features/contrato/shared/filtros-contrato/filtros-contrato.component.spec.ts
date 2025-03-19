import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosContratoComponent } from './filtros-contrato.component';

describe('FiltrosContratoComponent', () => {
  let component: FiltrosContratoComponent;
  let fixture: ComponentFixture<FiltrosContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosContratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltrosContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
