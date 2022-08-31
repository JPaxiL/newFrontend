import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanalDashboardComponent } from './panal-dashboard.component';

describe('PanalDashboardComponent', () => {
  let component: PanalDashboardComponent;
  let fixture: ComponentFixture<PanalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanalDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
