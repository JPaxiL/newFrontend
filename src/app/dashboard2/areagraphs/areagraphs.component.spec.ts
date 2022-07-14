import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreagraphsComponent } from './areagraphs.component';

describe('AreagraphsComponent', () => {
  let component: AreagraphsComponent;
  let fixture: ComponentFixture<AreagraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreagraphsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreagraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
