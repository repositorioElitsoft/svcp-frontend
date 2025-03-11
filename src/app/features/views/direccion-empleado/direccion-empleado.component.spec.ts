import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionEmpleadoComponent } from './direccion-empleado.component';

describe('DireccionEmpleadoComponent', () => {
  let component: DireccionEmpleadoComponent;
  let fixture: ComponentFixture<DireccionEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DireccionEmpleadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DireccionEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
