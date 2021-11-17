import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertAccessoriesEditComponent } from './alert-accessories-edit.component';

describe('AlertAccessoriesEditComponent', () => {
  let component: AlertAccessoriesEditComponent;
  let fixture: ComponentFixture<AlertAccessoriesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertAccessoriesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAccessoriesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
