import { TestBed } from '@angular/core/testing';

import { MinimapServiceService } from './minimap-service.service';

describe('MinimapServiceService', () => {
  let service: MinimapServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinimapServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
