import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaSectorComponent } from './busqueda-sector.component';

describe('BusquedaSectorComponent', () => {
  let component: BusquedaSectorComponent;
  let fixture: ComponentFixture<BusquedaSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaSectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusquedaSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
