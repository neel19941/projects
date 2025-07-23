import { TestBed } from '@angular/core/testing';

import { LoanSanctionService } from './loan-sanction.service';

describe('LoanSanctionService', () => {
  let service: LoanSanctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanSanctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
