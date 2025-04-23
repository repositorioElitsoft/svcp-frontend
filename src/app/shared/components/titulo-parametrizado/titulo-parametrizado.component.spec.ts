import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloParametrizadoComponent } from './titulo-parametrizado.component';

describe('TituloParametrizadoComponent', () => {
  let component: TituloParametrizadoComponent;
  let fixture: ComponentFixture<TituloParametrizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TituloParametrizadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TituloParametrizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
