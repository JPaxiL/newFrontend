import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAlertComponent } from './active-alert.component';

describe('ActiveAlertComponent', () => {
  let component: ActiveAlertComponent;
  let fixture: ComponentFixture<ActiveAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
