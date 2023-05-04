import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversModalComponent } from './drivers-modal.component';

describe('DriversModalComponent', () => {
  let component: DriversModalComponent;
  let fixture: ComponentFixture<DriversModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriversModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
