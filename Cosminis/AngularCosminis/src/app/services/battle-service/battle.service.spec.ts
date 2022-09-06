import { TestBed } from '@angular/core/testing';

import { BattleService } from './battle.service';

describe('BattleService', () => {
  let service: BattleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
