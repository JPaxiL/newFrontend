import { TestBed } from '@angular/core/testing';

import { MinimapToolbarService } from './minimap-toolbar.service';

describe('MinimapToolbarService', () => {
  let service: MinimapToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinimapToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
