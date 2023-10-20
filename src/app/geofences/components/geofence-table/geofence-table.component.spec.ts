import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceTableComponent } from './geofence-table.component';

describe('GeofenceTableComponent', () => {
  let component: GeofenceTableComponent;
  let fixture: ComponentFixture<GeofenceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeofenceTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
