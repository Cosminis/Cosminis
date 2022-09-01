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
  
  OpponentRoster: Cosminis[] = [];
  PlayerRoster: Cosminis[] = [];
  PlayerGoldBet: number = 0;
  PlayerRisk: number = 0;

  OpponentCosmini2Battle: Cosminis = {
    companionId: 0,
    trainerId : 0,
    userFk : 0,
    speciesFk : 0,
    nickname : "OpponentCosmini",
    emotion : 0,
    mood : 0,
    hunger : 0,
  };

  PlayerCosmini2Battle: Cosminis = {
    companionId: 0,
    trainerId : 0,
    userFk : 0,
    speciesFk : 0,
    nickname : "PlayerCosmini",
    emotion : 0,
    mood : 0,
    hunger : 0,
  };
  
  CreateARandoRoster() {
    this.battle.CreateRoster().subscribe((res) => this.OpponentRoster = res);
  }

  CreateAFriendRoster() {
    this.battle.CreateRosterWithId(this.battle.GetRandomFriendsUserId()).subscribe((res) => this.OpponentRoster = res);
  }

  CreatePlayerRoster() {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    this.battle.CreateRosterWithId(currentUser.userId as number).subscribe((res) => this.PlayerRoster = res);

  }

  CutRosters() {
    if (this.OpponentRoster.length > 6) {
      this.OpponentRoster.splice(6, this.OpponentRoster.length - 6); //id like this to be random
    }

    if (this.PlayerRoster.length > 6) {
      this.PlayerRoster.splice(6, this.PlayerRoster.length - 6); //id like this to be random
    }
  }

  OpponentChoosesCosmini() {
    this.OpponentCosmini2Battle = this.OpponentRoster[Math.floor(Math.random() * 7)];
  }

  PlayerChoosesCosmini(Choice: number) {
    this.PlayerCosmini2Battle = this.PlayerRoster[Choice];
  }

  ObtainBattleResult() {

  }
  
  ngOnInit(): void {
  }

}
