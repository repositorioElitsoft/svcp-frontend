import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosProductosComponent } from './servicios-productos.component';

describe('ServiciosProductosComponent', () => {
  let component: ServiciosProductosComponent;
  let fixture: ComponentFixture<ServiciosProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiciosProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
