import { TestBed } from '@angular/core/testing';

import { ResourceApiServicesService } from './resource-api-service.service';

describe('ResourceApiServiceService', () => {
  let service: ResourceApiServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceApiServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
