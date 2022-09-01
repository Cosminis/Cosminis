import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friends } from '../Models/Friends';
import { BattleService } from '../services/battle-service/battle.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { FriendsService } from '../services/Friends-api-service/friends.service'
import { Users } from '../Models/User';
import { Cosminis } from '../Models/Cosminis';

@Component({
  selector: 'app-battle-menu',
  templateUrl: './battle-menu.component.html',
  styleUrls: ['./battle-menu.component.css']
})
  
export class BattleMenuComponent implements OnInit {

  constructor(private battle: BattleService,
    private user: UserApiServicesService,
    private friend: FriendsService,
    private router: Router) { }
  
  OpponentRoster: Cosminis[] = [];
  PlayerRoster: Cosminis[] = [];
  PlayerGoldBet: number = 0;
  PlayerRisk: number = 0;
  WinStreak: number = 0;
  LoseStreak: number = 0;
  
  Starting: boolean = true;
  Picking: boolean = true;
  Battling: boolean = true;
  Lost: boolean = true;
  Won: boolean = true;

  /*
    starting
    --> roster will be name for opponent and player
    --> cutroster
    --> risk factor
    --> place bet
----picking
|   --> choosing cosminis to fight
----battling
    --> obtain victor
    --> increment lose or win
    Won
    --> cash out
    --> play again?
    Lost
    --> play again?
  */


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

  CalculateRiskFactor()
  {
    let CompleteRoster = [];
    CompleteRoster = this.PlayerRoster.concat(this.OpponentRoster);
    this.battle.DifficultyScale(CompleteRoster, this.PlayerRoster.length).subscribe((res) => this.PlayerRisk = res);
  }

  OpponentChoosesCosmini() {
    this.OpponentCosmini2Battle = this.OpponentRoster[Math.floor(Math.random() * 7)];
  }

  PlayerChoosesCosmini(Choice: number) {
    this.PlayerCosmini2Battle = this.PlayerRoster[Choice];
  }

  ObtainBattleResult()
  {
    let BattleResult: number;
    this.battle.BattleResult(this.PlayerCosmini2Battle.companionId, this.OpponentCosmini2Battle.companionId).subscribe((res) => {
      BattleResult = res;
      if (BattleResult == 0)
      {
        this.WinStreak++;
      }
      else if (BattleResult == 1)
      {
        this.LoseStreak++;
      }
    })
  }

  StartGame()
  {
    while (this.Starting)
    {
      this.CreatePlayerRoster();
      this.CutRosters();
      this.CalculateRiskFactor
      
    }
  }



  ngOnInit(): void {
  }

}
