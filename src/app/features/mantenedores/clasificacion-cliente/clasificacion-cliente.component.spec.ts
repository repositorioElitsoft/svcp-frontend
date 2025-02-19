import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionClienteComponent } from './clasificacion-cliente.component';

describe('ClasificacionClienteComponent', () => {
  let component: ClasificacionClienteComponent;
  let fixture: ComponentFixture<ClasificacionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasificacionClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasificacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
