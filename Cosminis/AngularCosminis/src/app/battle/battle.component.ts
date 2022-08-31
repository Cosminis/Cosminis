import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friends } from '../Models/Friends';
import { BattleService } from '../services/battle-service/battle.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { FriendsService } from '../services/Friends-api-service/friends.service'
import { Users } from '../Models/User';
import { Cosminis } from '../Models/Cosminis';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
  
export class BattleComponent implements OnInit {

  constructor(private battle: BattleService,
    private user: UserApiServicesService,
    private friend: FriendsService,
    private router: Router) { }
  
  
  hi: string = 'hi';

  GetFriendId(): number {
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

  GetRandomId(): number {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    let FriendId: number = 0;

    return 0;
  }

  
  
  ngOnInit(): void {
  }

}
