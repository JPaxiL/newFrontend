import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAlertsGpsComponent } from './panel-alerts-gps.component';

describe('PanelAlertsGpsComponent', () => {
  let component: PanelAlertsGpsComponent;
  let fixture: ComponentFixture<PanelAlertsGpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelAlertsGpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAlertsGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
