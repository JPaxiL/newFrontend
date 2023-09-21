import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaAllListsComponent } from './geocerca-all-lists.component';

describe('GeocercaAllListsComponent', () => {
  let component: GeocercaAllListsComponent;
  let fixture: ComponentFixture<GeocercaAllListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaAllListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaAllListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
