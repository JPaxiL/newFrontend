import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfComponent } from './panel-conf.component';

describe('PanelConfComponent', () => {
  let component: PanelConfComponent;
  let fixture: ComponentFixture<PanelConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
