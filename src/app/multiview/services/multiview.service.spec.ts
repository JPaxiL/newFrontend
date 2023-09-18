import { TestBed } from '@angular/core/testing';

import { MultiviewService } from './multiview.service';

describe('MultiviewService', () => {
  let service: MultiviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
