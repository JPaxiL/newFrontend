import { TestBed } from '@angular/core/testing';

import { GeopointsMinimapService } from './geopoints-minimap.service';

describe('GeopointsMinimapService', () => {
  let service: GeopointsMinimapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeopointsMinimapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
