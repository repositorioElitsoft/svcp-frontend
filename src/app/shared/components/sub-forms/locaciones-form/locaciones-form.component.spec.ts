import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacionesFormComponent } from './locaciones-form.component';

describe('LocacionesFormComponent', () => {
  let component: LocacionesFormComponent;
  let fixture: ComponentFixture<LocacionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacionesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
