import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsAlertsCreateComponent } from './gps-alerts-create.component';

describe('GpsAlertsCreateComponent', () => {
  let component: GpsAlertsCreateComponent;
  let fixture: ComponentFixture<GpsAlertsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsAlertsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsAlertsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
