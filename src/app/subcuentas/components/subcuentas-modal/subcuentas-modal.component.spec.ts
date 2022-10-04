import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcuentasModalComponent } from './subcuentas-modal.component';

describe('SubcuentasModalComponent', () => {
  let component: SubcuentasModalComponent;
  let fixture: ComponentFixture<SubcuentasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcuentasModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcuentasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
