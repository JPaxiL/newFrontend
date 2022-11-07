import { TestBed } from '@angular/core/testing';

import { ToolbarMapService } from './toolbar-map.service';

describe('ToolbarMapService', () => {
  let service: ToolbarMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
