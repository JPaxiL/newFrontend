import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaPolylineAddComponent } from './geocerca-polyline-add.component';

describe('GeocercaPolylineAddComponent', () => {
  let component: GeocercaPolylineAddComponent;
  let fixture: ComponentFixture<GeocercaPolylineAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaPolylineAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaPolylineAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
