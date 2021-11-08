import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHistorialGraficoComponent } from './panel-historial-grafico.component';

describe('PanelHistorialGraficoComponent', () => {
  let component: PanelHistorialGraficoComponent;
  let fixture: ComponentFixture<PanelHistorialGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelHistorialGraficoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHistorialGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
