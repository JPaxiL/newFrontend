import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFiltresComponent } from './table-filtres.component';

describe('TableFiltresComponent', () => {
  let component: TableFiltresComponent;
  let fixture: ComponentFixture<TableFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFiltresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFiltresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
