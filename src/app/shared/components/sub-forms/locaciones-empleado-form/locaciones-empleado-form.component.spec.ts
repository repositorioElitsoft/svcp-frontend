import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacionesEmpleadoFormComponent } from './locaciones-empleado-form.component';

describe('LocacionesFormComponent', () => {
  let component: LocacionesEmpleadoFormComponent;
  let fixture: ComponentFixture<LocacionesEmpleadoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacionesEmpleadoFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocacionesEmpleadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
