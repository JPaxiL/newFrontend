import { TestBed } from '@angular/core/testing';

import { GeopointsService } from './geopoints.service';

describe('GeopointsService', () => {
  let service: GeopointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeopointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
