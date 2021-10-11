import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsHeaderComponent } from './gps-header.component';

describe('GpsHeaderComponent', () => {
  let component: GpsHeaderComponent;
  let fixture: ComponentFixture<GpsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
