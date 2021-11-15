import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAlertsPlatformComponent } from './panel-alerts-platform.component';

describe('PanelAlertsPlatformComponent', () => {
  let component: PanelAlertsPlatformComponent;
  let fixture: ComponentFixture<PanelAlertsPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelAlertsPlatformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAlertsPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
