import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditmapComponent } from './auditmap.component';

describe('AuditmapComponent', () => {
  let component: AuditmapComponent;
  let fixture: ComponentFixture<AuditmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
