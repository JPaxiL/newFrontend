import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHistorialComponent } from './panel-historial.component';

describe('PanelHistorialComponent', () => {
  let component: PanelHistorialComponent;
  let fixture: ComponentFixture<PanelHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelHistorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
