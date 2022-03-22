import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAlertsEditComponent } from './platform-alerts-edit.component';

describe('PlatformAlertsEditComponent', () => {
  let component: PlatformAlertsEditComponent;
  let fixture: ComponentFixture<PlatformAlertsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformAlertsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformAlertsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
