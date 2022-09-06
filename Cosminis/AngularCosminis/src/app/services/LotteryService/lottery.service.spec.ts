import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '@auth0/auth0-angular';
import { Users } from 'src/app/Models/User';

import { LotteryService } from './lottery.service';

describe('LotteryService', () => {
  let service: LotteryService;
  let time:any = Date.now();
  let user: Users = {
    username: '',
    password: '',
    goldCount: 0,
    eggCount: 0,
    gemCount: 0,
    showcaseCompanion_fk: 0,
    aboutMe: '',
    account_age: time,
    eggTimer: time
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(LotteryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('can play does work', () => {
    service.CanPlay(5,1).subscribe(result =>{
      expect(result).toBeTruthy();
      expect(result).toHaveSize(1);
      expect(result).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  })
  it('give reward does work', () => {
    service.GiveRewards(1, user).subscribe(result => {
      expect(result).toBeTruthy();
      expect(result).toHaveSize(1);
      expect(result).toHaveBeenCalled();
    });
  })
});
