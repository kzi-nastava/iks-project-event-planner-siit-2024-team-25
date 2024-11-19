import { TestBed } from '@angular/core/testing';

import { OfferingServiceService } from './offering-service.service';

describe('OfferingServiceService', () => {
  let service: OfferingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
