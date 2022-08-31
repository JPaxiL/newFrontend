import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcuentasComponent } from './subcuentas.component';

describe('SubcuentasComponent', () => {
  let component: SubcuentasComponent;
  let fixture: ComponentFixture<SubcuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcuentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
