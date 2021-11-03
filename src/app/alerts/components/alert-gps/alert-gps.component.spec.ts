import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertGpsComponent } from './alert-gps.component';

describe('AlertGpsComponent', () => {
  let component: AlertGpsComponent;
  let fixture: ComponentFixture<AlertGpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertGpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
