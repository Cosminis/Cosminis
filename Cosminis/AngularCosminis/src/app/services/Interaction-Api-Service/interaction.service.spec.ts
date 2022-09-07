import { TestBed } from '@angular/core/testing';

import { InteractionService } from './interaction.service';

describe('InteractionService', () => {
  let service: InteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractionService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
