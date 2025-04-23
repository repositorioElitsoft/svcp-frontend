import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacionClienteComponent } from './locacion-cliente.component';

describe('LocacionClienteComponent', () => {
  let component: LocacionClienteComponent;
  let fixture: ComponentFixture<LocacionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacionClienteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
