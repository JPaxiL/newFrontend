import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionHeaderComponent } from './transmission-header.component';

describe('TransmissionHeaderComponent', () => {
  let component: TransmissionHeaderComponent;
  let fixture: ComponentFixture<TransmissionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
