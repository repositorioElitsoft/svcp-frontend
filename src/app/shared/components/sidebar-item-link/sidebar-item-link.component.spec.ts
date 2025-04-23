import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarItemLinkComponent } from './sidebar-item-link.component';

describe('SidebarItemLinkComponent', () => {
  let component: SidebarItemLinkComponent;
  let fixture: ComponentFixture<SidebarItemLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarItemLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarItemLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
