import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLabelsComponent } from './table-labels.component';

describe('TableLabelsComponent', () => {
  let component: TableLabelsComponent;
  let fixture: ComponentFixture<TableLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
