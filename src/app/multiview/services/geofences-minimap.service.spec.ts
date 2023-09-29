import { TestBed } from '@angular/core/testing';

import { GeofencesMinimapService } from './geofences-minimap.service';

describe('GeofencesMinimapService', () => {
  let service: GeofencesMinimapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeofencesMinimapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
