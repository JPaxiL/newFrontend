import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGeoDetComponent } from './modal-geo-det.component';

describe('ModalGeoDetComponent', () => {
  let component: ModalGeoDetComponent;
  let fixture: ComponentFixture<ModalGeoDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGeoDetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGeoDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
