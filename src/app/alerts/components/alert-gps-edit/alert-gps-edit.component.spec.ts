import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertGpsEditComponent } from './alert-gps-edit.component';

describe('AlertGpsEditComponent', () => {
  let component: AlertGpsEditComponent;
  let fixture: ComponentFixture<AlertGpsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertGpsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertGpsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
