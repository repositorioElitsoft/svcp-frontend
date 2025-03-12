import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelLocacionComponent } from './expansion-panel-locacion.component';

describe('ExpansionPanelLocacionComponent', () => {
  let component: ExpansionPanelLocacionComponent;
  let fixture: ComponentFixture<ExpansionPanelLocacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionPanelLocacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpansionPanelLocacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
