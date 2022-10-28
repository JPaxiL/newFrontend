import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInfoActivityComponent } from './audit-info-activity.component';

describe('AuditInfoActivityComponent', () => {
  let component: AuditInfoActivityComponent;
  let fixture: ComponentFixture<AuditInfoActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditInfoActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditInfoActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
