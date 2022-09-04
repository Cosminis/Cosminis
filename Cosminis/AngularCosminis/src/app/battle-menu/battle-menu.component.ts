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
  roundCount: number = 0;
  maxRoundCount: number = 0;
  ConfirmedGold:number = 0;

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

  Opponent: string = "placeholdername for id or something";

  BattleMode: string = "Random"; //this need to be gathered from session storage, setting a default for now

  Picked:boolean = false;
  betting: boolean = true;
  Starting: boolean = false;
  Picking: boolean = false;
  MadeOpponentRoster: boolean = false;
  MadePlayerRoster:boolean = false;
  Battling: boolean = false;
  Lost: boolean = false;
  Won: boolean = false;

  GamePlayLoop()
  {
    if(this.betting)
    {
      console.log("Betting...");
      if(this.ConfirmedGold)
      {
        this.betting = false;
        this.Starting = true;
        this.GamePlayLoop();
      }
    }
    else if(this.Starting)
    {
      console.log("Starting...");
      this.battle.OnGameStartUp();

      //gathering appropriate roster determined by player preference
      if (this.MadeOpponentRoster == false) {
        if (this.BattleMode === "Random")
        {
          this.CreateARandoRoster();
        }
        else if (this.BattleMode === "Friend")
        {
          this.CreateAFriendRoster();
        }
        else
        {
          this.CreateARandoRoster();
        }
      }
      //gather player's roster
      this.CreatePlayerRoster();

      //Determine the maximum game length

      //determine risk factor
      if(this.MadeOpponentRoster && this.MadePlayerRoster)
      {
        this.CalculateRiskFactor();
      }

      //lock in the bet
      
      //state transition
      if (this.MadeOpponentRoster == true)
      {
        this.PlaceBet();
        this.Starting = false;
        this.Picking = true;
      }
    }
    else if(this.Picking)
    {
      console.log("Picking...");
      //may both side of the combatant get ready please
      if(this.Picked)
      {
        this.OpponentChoosesCosmini();
  
        //state transition
        this.Picked = false;
        this.Picking = false;
        this.Battling = true;
        this.GamePlayLoop();
      }
    }
    else if(this.Battling)
    {
      console.log("Battling...");
      //and our champion is...
      this.ObtainBattleResult(); //apparently this already increments the appropriate count
    }
    else if(this.Lost)
    {
      console.log("Lost...");
      alert("You Have Lost All of Your Money, Have You Tried Betting More?");
      //you stink, click a button to either route you back to the picking page to play again or back to home
    }
    else if(this.Won)
    {
      console.log("Won...");
      //payout
      this.Payout();
      console.log("Paid");

      //you stink, click a button to either route you back to the picking page to play again or back to home
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
      this.GamePlayLoop();
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
      this.MadePlayerRoster = true;
      this.CutRosters();
      this.GamePlayLoop();
    });

  }

  CutRosters() {
    if (this.OpponentRoster.length > 6) {
      this.OpponentRoster.splice(5, this.OpponentRoster.length - 6); //id like this to be random
    }

    if (this.PlayerRoster.length > 6) {
      this.PlayerRoster.splice(5, this.PlayerRoster.length - 6); //id like this to be random
    }
    this.maxRoundCount = this.battle.BattleLength(this.OpponentRoster, this.PlayerRoster);
  }

  CalculateRiskFactor()
  {
    let CompleteRoster = [];
    let RosterID :number[] = [];
    CompleteRoster = this.PlayerRoster.concat(this.OpponentRoster);

    CompleteRoster.forEach(function (value)
    {
      RosterID.push(value.companionId);
    });
    
    this.battle.DifficultyScale(RosterID, this.PlayerRoster.length).subscribe((res) => this.PlayerRisk = res);
  }

  OpponentChoosesCosmini() {
    this.OpponentCosmini2Battle = this.OpponentRoster[Math.floor(Math.random() * this.OpponentRoster.length)];
  }

  PlayerChoosesCosmini(Choice: Cosminis) {
    this.PlayerCosmini2Battle = Choice;
  }

  ObtainBattleResult()
  {
    let BattleResult: number;
    this.battle.BattleResult(this.PlayerCosmini2Battle.companionId, this.OpponentCosmini2Battle.companionId).subscribe((res) => 
    {
      BattleResult = res;
      if (BattleResult == 0)
      {
        this.WinStreak++;
        this.roundCount++;
      }
      else if (BattleResult == 1)
      {
        this.LoseStreak++;
        this.roundCount++;
      }
      else
      {
        this.roundCount++;
      }

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
      this.GamePlayLoop();
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

  ConfirmingPick()
  {
    //this.LoseStreak ++;
    this.Picked = true;
    this.GamePlayLoop();
  }

  ngOnInit(): void
  {
    this.GamePlayLoop()
  }

}
