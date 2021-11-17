import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesAlertsListComponent } from './accessories-alerts-list.component';

describe('AccessoriesAlertsListComponent', () => {
  let component: AccessoriesAlertsListComponent;
  let fixture: ComponentFixture<AccessoriesAlertsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoriesAlertsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoriesAlertsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
