import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAlertsAccessoriesComponent } from './panel-alerts-accessories.component';

describe('PanelAlertsAccessoriesComponent', () => {
  let component: PanelAlertsAccessoriesComponent;
  let fixture: ComponentFixture<PanelAlertsAccessoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelAlertsAccessoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAlertsAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
