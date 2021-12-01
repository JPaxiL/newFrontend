import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaAddComponent } from './geocerca-add.component';

describe('GeocercaAddComponent', () => {
  let component: GeocercaAddComponent;
  let fixture: ComponentFixture<GeocercaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
