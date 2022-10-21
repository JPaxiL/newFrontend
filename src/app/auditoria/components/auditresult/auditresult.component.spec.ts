import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditresultComponent } from './auditresult.component';

describe('AuditresultComponent', () => {
  let component: AuditresultComponent;
  let fixture: ComponentFixture<AuditresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditresultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
