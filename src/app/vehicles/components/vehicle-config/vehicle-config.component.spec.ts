import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleConfigComponent } from './vehicle-config.component';

describe('VehicleConfigComponent', () => {
  let component: VehicleConfigComponent;
  let fixture: ComponentFixture<VehicleConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
