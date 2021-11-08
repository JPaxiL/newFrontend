import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsAlertComponent } from './actions-alert.component';

describe('ActionsAlertComponent', () => {
  let component: ActionsAlertComponent;
  let fixture: ComponentFixture<ActionsAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionsAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
