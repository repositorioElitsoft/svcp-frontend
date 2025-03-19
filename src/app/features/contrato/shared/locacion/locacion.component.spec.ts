import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacionComponent } from './locacion.component';

describe('LocacionComponent', () => {
  let component: LocacionComponent;
  let fixture: ComponentFixture<LocacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
