import { TestBed } from '@angular/core/testing';

import { HrmService } from './hrm.service';

describe('HrmService', () => {
  let service: HrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
