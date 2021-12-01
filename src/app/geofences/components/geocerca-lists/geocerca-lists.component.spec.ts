import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercaListsComponent } from './geocerca-lists.component';

describe('GeocercaListsComponent', () => {
  let component: GeocercaListsComponent;
  let fixture: ComponentFixture<GeocercaListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercaListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercaListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
