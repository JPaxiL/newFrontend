import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAlertsComponent } from './panel-alerts.component';

describe('PanelAlertsComponent', () => {
  let component: PanelAlertsComponent;
  let fixture: ComponentFixture<PanelAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelAlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
