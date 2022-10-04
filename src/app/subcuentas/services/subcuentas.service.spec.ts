import { TestBed } from '@angular/core/testing';

import { SubcuentasService } from './subcuentas.service';

describe('SubcuentasService', () => {
  let service: SubcuentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcuentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
