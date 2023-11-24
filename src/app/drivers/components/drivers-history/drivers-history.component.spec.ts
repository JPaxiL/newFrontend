import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversHistoryComponent } from './drivers-history.component';

describe('DriversHistoryComponent', () => {
  let component: DriversHistoryComponent;
  let fixture: ComponentFixture<DriversHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriversHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
