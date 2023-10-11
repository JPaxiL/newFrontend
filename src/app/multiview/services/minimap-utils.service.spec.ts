import { TestBed } from '@angular/core/testing';

import { MinimapUtilsService } from './minimap-utils.service';

describe('MinimapUtilsService', () => {
  let service: MinimapUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinimapUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
