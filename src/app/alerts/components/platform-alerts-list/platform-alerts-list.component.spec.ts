import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAlertsListComponent } from './platform-alerts-list.component';

describe('PlatformAlertsListComponent', () => {
  let component: PlatformAlertsListComponent;
  let fixture: ComponentFixture<PlatformAlertsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformAlertsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformAlertsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
