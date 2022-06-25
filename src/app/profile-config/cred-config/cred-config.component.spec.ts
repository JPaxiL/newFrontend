import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredConfigComponent } from './cred-config.component';

describe('CredConfigComponent', () => {
  let component: CredConfigComponent;
  let fixture: ComponentFixture<CredConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CredConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
