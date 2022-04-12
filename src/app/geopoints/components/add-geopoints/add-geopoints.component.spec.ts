import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeopointsComponent } from './add-geopoints.component';

describe('AddGeopointsComponent', () => {
  let component: AddGeopointsComponent;
  let fixture: ComponentFixture<AddGeopointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGeopointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeopointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
