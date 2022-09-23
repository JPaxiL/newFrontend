import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcuentasPanelComponent } from './subcuentas-panel.component';

describe('SubcuentasPanelComponent', () => {
  let component: SubcuentasPanelComponent;
  let fixture: ComponentFixture<SubcuentasPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcuentasPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcuentasPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
