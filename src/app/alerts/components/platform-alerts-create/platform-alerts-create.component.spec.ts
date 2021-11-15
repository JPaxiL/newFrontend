import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformAlertsCreateComponent } from './platform-alerts-create.component';

describe('PlatformAlertsCreateComponent', () => {
  let component: PlatformAlertsCreateComponent;
  let fixture: ComponentFixture<PlatformAlertsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformAlertsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformAlertsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
