import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderMultimediaComponent } from './slider-multimedia.component';

describe('SliderMultimediaComponent', () => {
  let component: SliderMultimediaComponent;
  let fixture: ComponentFixture<SliderMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderMultimediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
