import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagImeiComponent } from './tag-imei.component';

describe('TagImeiComponent', () => {
  let component: TagImeiComponent;
  let fixture: ComponentFixture<TagImeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagImeiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
