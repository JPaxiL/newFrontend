import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaPolylineMainComponent } from './geocerca-polyline-main.component';

describe('GeocercaPolylineMainComponent', () => {
  let component: GeocercaPolylineMainComponent;
  let fixture: ComponentFixture<GeocercaPolylineMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaPolylineMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaPolylineMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
