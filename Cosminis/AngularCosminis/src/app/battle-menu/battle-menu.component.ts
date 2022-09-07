import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BattleService } from '../services/battle-service/battle.service';
import { FriendsService } from '../services/Friends-api-service/friends.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';

import { Users } from '../Models/User';
import { Cosminis } from '../Models/Cosminis';
import { Friends } from '../Models/Friends';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-battle-menu',
  templateUrl: './battle-menu.component.html',
  styleUrls: ['./battle-menu.component.css']
})
  
export class BattleMenuComponent implements OnInit {

  constructor(private battle: BattleService,
    private router: Router,
    private friend: FriendsService,
    private user: UserApiServicesService) { }
  
  OpponentRoster: Cosminis[] = [];
  PlayerRoster: Cosminis[] = [];
  PlayerGoldBet: number = 0;
  PlayerRisk: number = 0;
  WinStreak: number = 0;
  LoseStreak: number = 0;
  tieCount:number = 0;
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

  DefaultCosmini2Battle: Cosminis = {
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
  CashedOut: boolean = false;

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
        else if (this.BattleMode === "Boss")
        {
          this.CreateBossRoster()
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
      if (this.DefaultCosmini2Battle.companionId == this.PlayerCosmini2Battle.companionId)
      {
        this.Picked = false;
        this.Picking = true;
        this.Battling = false;
      }
      else if (this.Picked)
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
      Swal.fire("You Have Lost All of Your Money; Have You Tried Betting More?", );
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
    else if(this.CashedOut)
    {
      console.log("You cashed out...");
      //payout
      this.Payout();

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
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    let FriendId: number = 0;
    let friends: Friends[] = [];

    this.friend.getAcceptedFriends(currentUser.username).subscribe((res) => {
      friends = res;
      
      let randoFriendinArr: number = Math.floor(Math.random() * friends.length);
      
      if (friends[randoFriendinArr].userIdTo == currentUser.userId)
      {
        FriendId = friends[randoFriendinArr].userIdFrom;
      }
      else
      {
        FriendId = friends[randoFriendinArr].userIdTo;
      }
      this.user.Find(FriendId).subscribe((res) => {
        this.Opponent = res.password
      })
      this.battle.CreateRosterWithId(FriendId).subscribe((res) => {
        this.OpponentRoster = res;
        for(let i=0;i<this.OpponentRoster.length;i++)
        {
          this.OpponentRoster[i].speciesNickname = this.battle.DisplayName.get(this.OpponentRoster[i].speciesFk);
          this.OpponentRoster[i].emotionString = this.battle.currentEmotion.get(this.OpponentRoster[i].emotion);
          this.OpponentRoster[i].image = this.battle.imageLib.get(this.OpponentRoster[i].speciesFk);
        }
        this.MadeOpponentRoster = true;
        this.CutRosters();
      });;
      });
  }

  CreateBossRoster() {
    this.battle.CreateRosterWithId(5).subscribe((res) => {
      this.OpponentRoster = res;
      for (let i = 0; i < this.OpponentRoster.length; i++) {
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

  OpponentChoosesCosmini()
  {
    let indexOfCosmini: number = Math.floor(Math.random() * this.OpponentRoster.length);
    if (this.OpponentRoster[indexOfCosmini].hasBattled)
    {
      this.OpponentChoosesCosmini();
    }
    this.OpponentRoster[indexOfCosmini].hasBattled = true;
    console.log(indexOfCosmini);
    this.OpponentCosmini2Battle = this.OpponentRoster[indexOfCosmini];
  }

  PlayerChoosesCosmini(Choice: Cosminis)
  {
    this.PlayerCosmini2Battle = Choice;
  }

  ObtainBattleResult()
  {
    let BattleResult: number;
    this.battle.BattleResult(this.PlayerCosmini2Battle.companionId, this.OpponentCosmini2Battle.companionId).subscribe((res) => 
    {
      for (let i = 0; i < this.PlayerRoster.length; i++)
      {
        if (this.PlayerCosmini2Battle.companionId == this.PlayerRoster[i].companionId)
        {
          this.PlayerRoster[i].hasBattled = true;
        }
      }
      
      BattleResult = res;
      if (BattleResult == 0)
      {
        if(this.OpponentCosmini2Battle.nickname)
        {
          Swal.fire("You won the round!", "Opponent Cosmini: " + this.OpponentCosmini2Battle.nickname + " is feeling pretty " + this.OpponentCosmini2Battle.emotionString + " about the lost.");
        }
        else
        {  
          Swal.fire("You won the round!", "Opponent Cosmini: " + this.OpponentCosmini2Battle.speciesNickname + " is feeling pretty " + this.OpponentCosmini2Battle.emotionString + " about the lost.");
        }
        this.WinStreak++;
        this.roundCount++;
      }
      else if (BattleResult == 1)
      {
        if(this.OpponentCosmini2Battle.nickname)
        {
          Swal.fire("You lost the round!", "Opponent Cosmini: " + this.OpponentCosmini2Battle.nickname + " is feeling pretty " + this.OpponentCosmini2Battle.emotionString + " about their victory.");
        }
        else
        {  
          Swal.fire("You lost the round!", "Opponent Cosmini: " + this.OpponentCosmini2Battle.speciesNickname + " is feeling pretty " + this.OpponentCosmini2Battle.emotionString + " about their victory.");
        }
        this.LoseStreak++;
        this.roundCount++;
      }
      else
      {
        if(this.OpponentCosmini2Battle.nickname)
        {
          Swal.fire("You tied the round!", "Opponent Cosmini: " + this.OpponentCosmini2Battle.nickname + " showed great respect to your Cosmini's combat prowess.");        
        }
        else
        {  
          Swal.fire("You tied the round!", "Opponent Cosmini: " + this.OpponentCosmini2Battle.speciesNickname + " showed great respect to your Cosmini's combat prowess.");
        }
        this.tieCount++;
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
      else //loop back to picking
      {
        this.Picking = true;
        this.Battling = false;
      }
      this.PlayerCosmini2Battle = this.DefaultCosmini2Battle;
      this.GamePlayLoop();
    })
  }

  PlaceBet()
  {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    this.battle.PlaceBet(currentUser.userId as number, this.ConfirmedGold);
  }

  Payout()
  {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    console.log("Paying");
    let amount:number = this.battle.Payout(currentUser.userId as number, this.PlayerGoldBet, this.PlayerRisk, this.WinStreak, this.tieCount);
    console.log(amount);
  }

  ConfirmBet()
  {
    let stringUser: string = sessionStorage.getItem('currentUser') as string;
    let currentUser: Users = JSON.parse(stringUser);
    if (isNaN(this.PlayerGoldBet))
    {
      Swal.fire("Please input a number!")
    }
    else if (this.PlayerGoldBet <= 0)
    {
      Swal.fire("Please input a POSITIVE number!")
    }
    else if (0 <= currentUser.goldCount)
    {
      console.log()
      this.ConfirmedGold = Math.round(this.PlayerGoldBet);
    }
    else
    {
      Swal.fire("You're in debt; you need to get more gold.")
    }
    this.GamePlayLoop();
  }

  ConfirmingPick()
  {
    //this.LoseStreak ++;
    this.Picked = true;
    this.GamePlayLoop();
  }

  ICanStopAnyTimeIWant()
  {
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }

  CashOut()
  {
    this.Picked = false;
    this.Picking = false;
    this.Battling = false;

    this.CashedOut = true;
    this.GamePlayLoop();
  }

  ngOnInit(): void
  {
    
    this.BattleMode = window.sessionStorage.getItem("BattleMode") as string;
    this.GamePlayLoop()
  }

}
