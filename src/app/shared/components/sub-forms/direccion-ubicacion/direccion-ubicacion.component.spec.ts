import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionUbicacionComponent } from './direccion-ubicacion.component';

describe('DireccionUbicacionComponent', () => {
  let component: DireccionUbicacionComponent;
  let fixture: ComponentFixture<DireccionUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DireccionUbicacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DireccionUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
