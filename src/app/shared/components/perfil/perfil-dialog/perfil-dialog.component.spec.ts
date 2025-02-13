import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDialogComponent } from './perfil-dialog.component';

describe('PerfilDialogComponent', () => {
  let component: PerfilDialogComponent;
  let fixture: ComponentFixture<PerfilDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
