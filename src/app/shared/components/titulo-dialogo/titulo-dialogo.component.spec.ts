import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TituloDialogoComponent } from './titulo-dialogo.component';

describe('TituloDialogoComponent', () => {
  let component: TituloDialogoComponent;
  let fixture: ComponentFixture<TituloDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TituloDialogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TituloDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
