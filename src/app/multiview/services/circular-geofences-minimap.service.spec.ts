import { TestBed } from '@angular/core/testing';

import { CircularGeofencesMinimapService } from './circular-geofences-minimap.service';

describe('CircularGeofencesMinimapService', () => {
  let service: CircularGeofencesMinimapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircularGeofencesMinimapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
