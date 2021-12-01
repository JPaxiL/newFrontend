import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGroupComponent } from './vehicle-group.component';

describe('VehicleGroupComponent', () => {
  let component: VehicleGroupComponent;
  let fixture: ComponentFixture<VehicleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
