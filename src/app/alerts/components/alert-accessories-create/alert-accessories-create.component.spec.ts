import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertAccessoriesCreateComponent } from './alert-accessories-create.component';

describe('AlertAccessoriesCreateComponent', () => {
  let component: AlertAccessoriesCreateComponent;
  let fixture: ComponentFixture<AlertAccessoriesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertAccessoriesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAccessoriesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
