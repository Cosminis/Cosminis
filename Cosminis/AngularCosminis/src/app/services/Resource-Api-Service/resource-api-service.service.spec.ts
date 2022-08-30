import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';


import { ResourceApiServicesService } from './resource-api-service.service';
import { HttpClient } from '@angular/common/http';

describe('ResourceApiServiceService', () => {
  let service: ResourceApiServicesService;
  let http: HttpClientTestingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ResourceApiServicesService);
    http = TestBed.inject(HttpClientTestingModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('PurchaseWithGems has returned the correct object', () => {
    
    service.PurchaseWithGems(20, [1, 1, 1, 1, 1, 1], 1, 10).subscribe(result => {
      expect(result).toBeTruthy();
      expect(result).toHaveSize(6);
      console.log("all good :)");
    });

  })
});
