import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeHeaderComponent } from './eye-header.component';

describe('EyeHeaderComponent', () => {
  let component: EyeHeaderComponent;
  let fixture: ComponentFixture<EyeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
