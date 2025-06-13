import { TestBed } from '@angular/core/testing';

import { FavouriteOfferingsService } from './favourite-offerings.service';

describe('FavouriteOfferingsService', () => {
  let service: FavouriteOfferingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteOfferingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
