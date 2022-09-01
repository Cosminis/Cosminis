import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/Models/User';
import { Friends } from 'src/app/Models/Friends';
import { environment } from 'src/environments/environment';
import { FriendsService } from '../Friends-api-service/friends.service';
import { Cosminis } from 'src/app/Models/Cosminis';

@Injectable({
  providedIn: 'root'
})
  
export class BattleService {
  
  constructor(private http: HttpClient,
    private friend: FriendsService
  ) { }

  apiUrl: string = environment.api + 'Battle/';

  //this generate a roster from a rando user
  CreateRoster(): Observable<Cosminis[]> {
    return this.http.get(this.apiUrl) as unknown as Observable<Cosminis[]>;
  }
  
  //this generates a roster from a given userId
  CreateRosterWithId(UserId: number): Observable<Cosminis[]> {
    return this.http.get(this.apiUrl + UserId) as unknown as Observable<Cosminis[]>;
  }
  
  //this will give who one!
  BattleResult(OpponentZero: number, OpponentOne: number): Observable<boolean> {
    return this.http.get(this.apiUrl + "Result/" + OpponentZero + "/" + OpponentOne) as unknown as Observable<boolean>;
  }
  
  //this obtains the difficult of the battle
  DifficultyScale(RosterOne: number[], RosterTwo: number[]): Observable<number> {
    return this.http.get(this.apiUrl + "Scalar"  + RosterOne + "/" + RosterTwo) as unknown  as Observable<number>;
  }
  
  //the length of the match is determined by the roster with the smallest amount of cosminis
  BattleLength(RosterOne: number[], RosterTwo: number[]): number {
    if (RosterOne.length > RosterTwo.length) {
      return RosterTwo.length;
    } else {
      return RosterOne.length;
    }
  }

  GetRandomFriendsUserId(): number {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    let FriendId: number = 0;
    let friends: Friends[] = [];

    this.friend.getAcceptedFriends(currentUser.username).subscribe((res) => friends = res);
    
    //gets a rando friends from user's friend list
    let randoFriendinArr: number = Math.floor(Math.random() * friends.length);
    if (friends[randoFriendinArr].userIdTo == currentUser.userId) {
      FriendId = friends[randoFriendinArr].userIdFrom;
    }
    else {
      FriendId = friends[randoFriendinArr].userIdTo;
    }
    return FriendId;
  }

  Payout(UserId: number, GoldBet: number, Difficulty: number, WinStreak: number): number {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);

    if (WinStreak == 0 || Difficulty == -100) {
      return 0;
    }
    
    let NewGoldPayout: number = Math.pow(GoldBet * (1 + (.1)), .1 * WinStreak);
    
    NewGoldPayout = NewGoldPayout + (NewGoldPayout * (Difficulty / 100));

    return NewGoldPayout;
  }


}
