import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowHeaderComponent } from './follow-header.component';

describe('FollowHeaderComponent', () => {
  let component: FollowHeaderComponent;
  let fixture: ComponentFixture<FollowHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
