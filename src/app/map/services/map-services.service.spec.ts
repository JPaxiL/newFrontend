import { TestBed } from '@angular/core/testing';

import { MapServicesService } from './map-services.service';

describe('MapServicesService', () => {
  let service: MapServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
