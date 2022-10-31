import { TestBed } from '@angular/core/testing';

import { InfoActivityService } from './info-activity.service';

describe('InfoActivityService', () => {
  let service: InfoActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
