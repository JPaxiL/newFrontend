import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcuentasListComponent } from './subcuentas-list.component';

describe('SubcuentasListComponent', () => {
  let component: SubcuentasListComponent;
  let fixture: ComponentFixture<SubcuentasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcuentasListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcuentasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
