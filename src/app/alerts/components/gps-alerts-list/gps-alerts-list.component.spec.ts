import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsAlertsListComponent } from './gps-alerts-list.component';

describe('GpsAlertsListComponent', () => {
  let component: GpsAlertsListComponent;
  let fixture: ComponentFixture<GpsAlertsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsAlertsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsAlertsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
