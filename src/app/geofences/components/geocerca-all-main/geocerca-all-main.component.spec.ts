import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaAllMainComponent } from './geocerca-all-main.component';

describe('GeocercaAllMainComponent', () => {
  let component: GeocercaAllMainComponent;
  let fixture: ComponentFixture<GeocercaAllMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaAllMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaAllMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
