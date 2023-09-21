import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaAllAddComponent } from './geocerca-all-add.component';

describe('GeocercaAllAddComponent', () => {
  let component: GeocercaAllAddComponent;
  let fixture: ComponentFixture<GeocercaAllAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaAllAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaAllAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
