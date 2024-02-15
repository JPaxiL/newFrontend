import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CipiaComponent } from './cipia.component';

describe('CipiaComponent', () => {
  let component: CipiaComponent;
  let fixture: ComponentFixture<CipiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CipiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CipiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
