import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionLaboralComponent } from './informacion-laboral.component';

describe('InformacionLaboralComponent', () => {
  let component: InformacionLaboralComponent;
  let fixture: ComponentFixture<InformacionLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionLaboralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformacionLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
