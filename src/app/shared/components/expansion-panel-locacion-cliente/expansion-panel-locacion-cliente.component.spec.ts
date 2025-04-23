import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelLocacionClienteComponent } from './expansion-panel-locacion-cliente.component';

describe('ExpansionPanelLocacionComponent', () => {
  let component: ExpansionPanelLocacionClienteComponent;
  let fixture: ComponentFixture<ExpansionPanelLocacionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionPanelLocacionClienteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExpansionPanelLocacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
