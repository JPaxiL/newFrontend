import { TestBed } from '@angular/core/testing';

import { PolylineMinimapService } from './polyline-minimap.service';

describe('PolylineMinimapService', () => {
  let service: PolylineMinimapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolylineMinimapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
