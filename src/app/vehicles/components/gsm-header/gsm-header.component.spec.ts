import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsmHeaderComponent } from './gsm-header.component';

describe('GsmHeaderComponent', () => {
  let component: GsmHeaderComponent;
  let fixture: ComponentFixture<GsmHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsmHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsmHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
