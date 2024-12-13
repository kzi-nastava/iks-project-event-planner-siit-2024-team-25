import { TestBed } from '@angular/core/testing';

import { OfferingCategoryService } from './offering-category.service';

describe('OfferingCategoryService', () => {
  let service: OfferingCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferingCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
