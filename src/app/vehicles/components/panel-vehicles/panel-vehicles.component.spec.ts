import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelVehiclesComponent } from './panel-vehicles.component';

describe('PanelVehiclesComponent', () => {
  let component: PanelVehiclesComponent;
  let fixture: ComponentFixture<PanelVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
