import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacionFormComponent } from './locacion-form.component';

describe('LocacionFormComponent', () => {
  let component: LocacionFormComponent;
  let fixture: ComponentFixture<LocacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
