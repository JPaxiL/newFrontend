import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMonitoreoComponent } from './panel-monitoreo.component';

describe('PanelMonitoreoComponent', () => {
  let component: PanelMonitoreoComponent;
  let fixture: ComponentFixture<PanelMonitoreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMonitoreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
