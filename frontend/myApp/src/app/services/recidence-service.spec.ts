import { TestBed } from '@angular/core/testing';

import { RecidenceService } from './recidence-service';

describe('RecidenceService', () => {
  let service: RecidenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecidenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
