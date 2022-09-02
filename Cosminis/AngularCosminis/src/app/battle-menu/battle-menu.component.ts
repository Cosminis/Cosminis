import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Friends } from '../Models/Friends';
import { BattleService } from '../services/battle-service/battle.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { FriendsService } from '../services/Friends-api-service/friends.service'
import { Users } from '../Models/User';
import { Cosminis } from '../Models/Cosminis';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-battle-menu',
  templateUrl: './battle-menu.component.html',
  styleUrls: ['./battle-menu.component.css']
})
  
export class BattleMenuComponent implements OnInit {

  constructor(private battle: BattleService) { }
  
  OpponentRoster: Cosminis[] = [];
  PlayerRoster: Cosminis[] = [];
  PlayerGoldBet: number = 0;
  PlayerRisk: number = 0;
  WinStreak: number = 0;
  LoseStreak: number = 0;
  ConfirmedGold:number = 0;
  fightingChoice: Cosminis = {
    companionId : 0,
    trainerId : 0,
    userFk : 0,
    speciesFk : 0,
    nickname : "string",
    emotion : 0,
    mood : 0,
    hunger : 0,
  };

  OpponentCosmini2Battle: Cosminis = {
    companionId: 0,
    trainerId : 0,
    userFk : 0,
    speciesFk : 0,
    nickname : "OpponentCosmini",
    emotion : 0,
    mood : 0,
    hunger: 0,
  };

  PlayerCosmini2Battle: Cosminis = {
    companionId: 0,
    trainerId : 0,
    userFk : 0,
    speciesFk : 0,
    nickname : "PlayerCosmini",
    emotion : 0,
    mood : 0,
    hunger: 0,
  };

  roundCount:number = 0;
  maxRoundCount: number = 0;
  Opponent: string = "placeholdername for id or something";

  BattleMode: string = "Random"; //this need to be gathered from session storage, setting a default for now
  
  betting: boolean = true;
  Starting: boolean = false;
  Picking: boolean = false;
  MadeOpponentRoster: boolean = false;
  Battling: boolean = false;
  Lost: boolean = false;
  Won: boolean = false;

  GamePlayLoop()
  {
    while (true) //infinite loop incoming
    {
      if(this.betting)
      {
        if(!this.ConfirmedGold)
        {
          console.log(this.betting);
          console.log(this.betting);
          break;
        }
        if(this.ConfirmedGold)
        {
          this.betting = false;
          this.Starting = true;

          console.log(this.betting);
          console.log(this.Starting);
          break;
        }
      }
      else if(this.Starting)
      {
        this.battle.OnGameStartUp();
        console.log(this.ConfirmedGold);

        //gathering appropriate roster determined by player preference
        if (this.MadeOpponentRoster == false) {
          if (this.BattleMode === "Random")
          {
            this.CreateARandoRoster();
          }
          else if (this.BattleMode === "Friend")
          {
            this.CreateAFriendRoster();
            console.log("randofriendroster");
          }
          else
          {
            this.CreateARandoRoster();
            console.log("default");
          }
        }
        //gather player's roster
        this.CreatePlayerRoster();


        //Determine the maximum game length
        this.maxRoundCount = this.battle.BattleLength(this.OpponentRoster, this.PlayerRoster);

        //determine risk factor
        this.CalculateRiskFactor();

        //lock in the bet
        this.PlaceBet();

        //state transition
        if (this.MadeOpponentRoster == true)
        {
          console.log(this.OpponentRoster);
          console.log(this.PlayerRoster);
          this.Starting = false;
          this.Picking = true;
          break;
        }
        break;
      }
      else if(this.Picking)
      {
        //may both side of the combatant get ready please
        this.OpponentChoosesCosmini();
        this.PlayerChoosesCosmini(this.fightingChoice);

        //state transition
        this.Picking = false;
        this.Battling = true;
        break;
      }
      else if(this.Battling)
      {
        //and our champion is...
        this.ObtainBattleResult(); //apparently this already increments the appropriate count
        if(this.LoseStreak>=2) //you have lost
        {
          this.Battling = false;
          this.Lost = true;
        }
        else if(this.roundCount >= this.maxRoundCount) //proceed to the payout screen
        {
          this.Battling = false;
          this.Won = true;
        }
        break;
      }
      else if(this.Lost)
      {
        //you stink, click a button to either route you back to the picking page to play again or back to home
        break;
      }
      else if(this.Won)
      {
        //payout
        this.Payout();
        break;

        //you stink, click a button to either route you back to the picking page to play again or back to home
      }
    }
  }
  
  CreateARandoRoster()
  {
    this.battle.CreateRoster().subscribe((res) => {
      this.OpponentRoster = res;
      for(let i=0;i<this.OpponentRoster.length;i++)
      {
        this.OpponentRoster[i].speciesNickname = this.battle.DisplayName.get(this.OpponentRoster[i].speciesFk);
        this.OpponentRoster[i].emotionString = this.battle.currentEmotion.get(this.OpponentRoster[i].emotion);
        this.OpponentRoster[i].image = this.battle.imageLib.get(this.OpponentRoster[i].speciesFk);
      }
      this.MadeOpponentRoster = true;
      this.CutRosters();
    })
  }

  CreateAFriendRoster() {
    this.battle.CreateRosterWithId(this.battle.GetRandomFriendsUserId()).subscribe((res) => {
      this.OpponentRoster = res;
      for(let i=0;i<this.OpponentRoster.length;i++)
      {
        this.OpponentRoster[i].speciesNickname = this.battle.DisplayName.get(this.OpponentRoster[i].speciesFk);
        this.OpponentRoster[i].emotionString = this.battle.currentEmotion.get(this.OpponentRoster[i].emotion);
        this.OpponentRoster[i].image = this.battle.imageLib.get(this.OpponentRoster[i].speciesFk);
        
      }
      this.MadeOpponentRoster = true;
      this.CutRosters();
    });
  }

  CreatePlayerRoster() {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    this.battle.CreateRosterWithId(currentUser.userId as number).subscribe((res) => {
      this.PlayerRoster = res;
      for(let i=0;i<this.PlayerRoster.length;i++)
      {
        this.PlayerRoster[i].speciesNickname = this.battle.DisplayName.get(this.PlayerRoster[i].speciesFk);
        this.PlayerRoster[i].emotionString = this.battle.currentEmotion.get(this.PlayerRoster[i].emotion);
        this.PlayerRoster[i].image = this.battle.imageLib.get(this.PlayerRoster[i].speciesFk);
        
      }
      this.CutRosters();
    });

  }

  CutRosters() {
    if (this.OpponentRoster.length > 6) {
      this.OpponentRoster.splice(5, this.OpponentRoster.length - 6); //id like this to be random
    }

    if (this.PlayerRoster.length > 6) {
      this.PlayerRoster.splice(5, this.PlayerRoster.length - 6); //id like this to be random
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

  PlayerChoosesCosmini(Choice: Cosminis) {
    this.PlayerCosmini2Battle = Choice;
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

  PlaceBet()
  {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    this.battle.PlaceBet(currentUser.userId as number, this.PlayerGoldBet);
  }

  Payout()
  {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    this.battle.Payout(currentUser.userId as number, this.PlayerGoldBet, this.PlayerRisk, this.WinStreak);
  }

  ConfirmBet()
  {
    this.ConfirmedGold = this.PlayerGoldBet;
    this.GamePlayLoop();
  }

  ngOnInit(): void
  {
    this.GamePlayLoop()
  }

}
