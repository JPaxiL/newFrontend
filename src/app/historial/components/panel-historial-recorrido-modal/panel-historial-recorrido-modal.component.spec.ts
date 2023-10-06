import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHistorialRecorridoModalComponent } from './panel-historial-recorrido-modal.component';

describe('PanelHistorialRecorridoModalComponent', () => {
  let component: PanelHistorialRecorridoModalComponent;
  let fixture: ComponentFixture<PanelHistorialRecorridoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelHistorialRecorridoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHistorialRecorridoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
