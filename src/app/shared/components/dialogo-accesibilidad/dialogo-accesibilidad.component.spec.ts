import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAccesibilidadComponent } from './dialogo-accesibilidad.component';

describe('DialogoAccesibilidadComponent', () => {
  let component: DialogoAccesibilidadComponent;
  let fixture: ComponentFixture<DialogoAccesibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoAccesibilidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogoAccesibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
