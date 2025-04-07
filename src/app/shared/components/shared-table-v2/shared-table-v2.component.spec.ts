import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableV2Component } from './shared-table-v2.component';

describe('SharedTableV2Component', () => {
  let component: SharedTableV2Component;
  let fixture: ComponentFixture<SharedTableV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
