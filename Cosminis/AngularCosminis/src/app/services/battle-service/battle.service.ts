import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/Models/User';
import { Friends } from 'src/app/Models/Friends';
import { environment } from 'src/environments/environment';
import { FriendsService } from '../Friends-api-service/friends.service';
import { Cosminis } from 'src/app/Models/Cosminis';
import { ResourceApiServicesService } from '../Resource-Api-Service/resource-api-service.service';
import { UserApiServicesService } from '../User-Api-Service/user-api-services.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
  
export class BattleService {
  
  constructor(private http: HttpClient,
    private friend: FriendsService,
    private resourceAPI: ResourceApiServicesService,
    private UserService: UserApiServicesService
  ) { }

  DisplayName = new Map<number, string>();
  currentEmotion = new Map<number, string>();
  imageLib = new Map<number, string>();

  OnGameStartUp() {
    this.DisplayName.set(3, "Infernog");
    this.DisplayName.set(4, "Pluto");
    this.DisplayName.set(5, "Buds");
    this.DisplayName.set(6, "Cosmo");
    this.DisplayName.set(7, "Librian");
    this.DisplayName.set(8, "Cancer");

    this.imageLib.set(3, "InfernogFire.png");
    this.imageLib.set(4, "plutofinal.png");
    this.imageLib.set(5, "15.png");
    this.imageLib.set(6, "cosmofinal.png");
    this.imageLib.set(7, "librianfinall.png");
    this.imageLib.set(8, "cancerfinal.png");

    this.currentEmotion.set(1, "Hopeless");
    this.currentEmotion.set(2, "hostile");
    this.currentEmotion.set(3, "Distant");
    this.currentEmotion.set(4, "Inadequate");
    this.currentEmotion.set(5, "Calm");
    this.currentEmotion.set(6, "Thankful");
    this.currentEmotion.set(7, "Happy");
    this.currentEmotion.set(8, "Playful");
    this.currentEmotion.set(9, "Inspired");
    this.currentEmotion.set(10, "Blissful");
  }

  apiUrl: string = environment.api + 'Battle/';

  //this generate a roster from a rando user
  CreateRoster(): Observable<Cosminis[]> {
    return this.http.get(this.apiUrl + "Roster") as unknown as Observable<Cosminis[]>;
  }
  
  //this generates a roster from a given userId
  CreateRosterWithId(UserId: number): Observable<Cosminis[]> {
    return this.http.get(this.apiUrl + "Opponent?OpponentID=" + UserId) as unknown as Observable<Cosminis[]>;
  }
  
  //this will give who one!
  BattleResult(OpponentZero: number, OpponentOne: number): Observable<number> {
    return this.http.get(this.apiUrl + "Result?CombatantZero=" + OpponentZero + "&CombatantOne=" + OpponentOne) as unknown as Observable<number>;
  }
  
  //this obtains the difficult of the battle
  DifficultyScale(CompleteRoster: number[], SizeOfPlayerRoster: number): Observable<number> {
    return this.http.put(this.apiUrl + "Scalar?SizeOne="+ SizeOfPlayerRoster, CompleteRoster) as unknown  as Observable<number>;
  }
  
  //the length of the match is determined by the roster with the smallest amount of cosminis
  BattleLength(RosterOne: Cosminis[], RosterTwo: Cosminis[]): number {
    if (RosterOne.length > RosterTwo.length) 
    {
      return RosterTwo.length;
    } 
    else 
    {
      return RosterOne.length;
    }
  }

  Payout(UserId: number, GoldBet: number, Difficulty: number, WinStreak: number, tieCount:number): number {
    if (Difficulty == -100) {
      return 0;
    }
    
    let NewGoldPayout = (GoldBet * 1.5 * WinStreak) + (GoldBet * tieCount * 0.5);

    NewGoldPayout = Math.round(NewGoldPayout);

    let Scalar:number = 1+(Difficulty/100);
    console.log(Scalar);

    NewGoldPayout = Math.round(Scalar*NewGoldPayout);

    this.resourceAPI.AddGold(UserId,NewGoldPayout).subscribe((res)=>
    {
      let stringUser: string = sessionStorage.getItem('currentUser') as string;
      let currentUser: Users = JSON.parse(stringUser);

      this.UserService.LoginOrReggi(currentUser).subscribe((res) => {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      });
      if (NewGoldPayout == 0)
      {
        Swal.fire("You've lost! Your payout is " + NewGoldPayout, "Your payout have a multiplier of:" + Scalar);
      }
      else
      {
        Swal.fire("You've won! Your payout is " + NewGoldPayout, "Your payout have a multiplier of:" + Scalar);
      }
    });


    return NewGoldPayout;
  }

  PlaceBet(UserId: number, GoldBet: number)
  {
    this.resourceAPI.AddGold(UserId,-1*GoldBet).subscribe();
  }
}
