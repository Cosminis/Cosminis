import { TestBed } from '@angular/core/testing';

import { UserApiServicesService } from './user-api-services.service';

describe('UserApiServicesService', () => {
  let service: UserApiServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserApiServicesService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
