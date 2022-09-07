import { TestBed } from '@angular/core/testing';

import { ComsinisApiServiceService } from './comsinis-api-service.service';

describe('ComsinisApiServiceService', () => {
  let service: ComsinisApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComsinisApiServiceService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
