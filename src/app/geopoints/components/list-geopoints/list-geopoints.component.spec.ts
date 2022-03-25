import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeopointsComponent } from './list-geopoints.component';

describe('ListGeopointsComponent', () => {
  let component: ListGeopointsComponent;
  let fixture: ComponentFixture<ListGeopointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGeopointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGeopointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
