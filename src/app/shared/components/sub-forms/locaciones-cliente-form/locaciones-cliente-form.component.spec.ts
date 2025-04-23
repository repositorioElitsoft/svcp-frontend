import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacionesClienteFormComponent } from './locaciones-cliente-form.component';

describe('LocacionesFormComponent', () => {
  let component: LocacionesClienteFormComponent;
  let fixture: ComponentFixture<LocacionesClienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacionesClienteFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocacionesClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
