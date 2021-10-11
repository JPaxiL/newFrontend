import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitHeaderComponent } from './limit-header.component';

describe('LimitHeaderComponent', () => {
  let component: LimitHeaderComponent;
  let fixture: ComponentFixture<LimitHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
