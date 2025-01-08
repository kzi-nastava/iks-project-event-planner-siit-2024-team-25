import { TestBed } from '@angular/core/testing';

import { SuspendUserService } from './suspend-user.service';

describe('SuspendUserService', () => {
  let service: SuspendUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuspendUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
