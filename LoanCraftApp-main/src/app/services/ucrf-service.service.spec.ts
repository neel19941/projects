import { TestBed } from '@angular/core/testing';

import { UcrfServiceService } from './ucrf-service.service';

describe('UcrfServiceService', () => {
  let service: UcrfServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UcrfServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
