import { TestBed } from '@angular/core/testing';

import { IdSaveService } from './id-save.service';

describe('IdSaveService', () => {
  let service: IdSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
