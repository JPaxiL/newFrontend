import { TestBed } from '@angular/core/testing';

import { GeofenceImportExportService } from './geofence-import-export.service';

describe('GeofenceImportExportService', () => {
  let service: GeofenceImportExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeofenceImportExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
