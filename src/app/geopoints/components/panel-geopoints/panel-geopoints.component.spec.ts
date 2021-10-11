import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGeopointsComponent } from './panel-geopoints.component';

describe('PanelGeopointsComponent', () => {
  let component: PanelGeopointsComponent;
  let fixture: ComponentFixture<PanelGeopointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelGeopointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelGeopointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
