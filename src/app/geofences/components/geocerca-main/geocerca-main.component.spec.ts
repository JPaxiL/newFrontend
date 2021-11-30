import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaMainComponent } from './geocerca-main.component';

describe('GeocercaMainComponent', () => {
  let component: GeocercaMainComponent;
  let fixture: ComponentFixture<GeocercaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
