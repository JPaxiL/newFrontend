import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofencesModalComponent } from './geofences-modal.component';

describe('GeofencesModalComponent', () => {
  let component: GeofencesModalComponent;
  let fixture: ComponentFixture<GeofencesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeofencesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
