import { Component, OnInit} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { InteractionService } from '../services/Interaction-Api-Service/interaction.service';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
import { FoodElement } from '../Models/FoodInventory';
import { Router } from '@angular/router';
import { Users } from '../Models/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(public auth0: AuthService, private router: Router, private interApi:InteractionService, private comsiniApi:ComsinisApiServiceService) { }
  foodDisplay : FoodElement[] = []

  foodQty : [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];

  currentUsername : string ="";
  currentUsernickname : string ="";
  userGold:number = 0;
  userEgg:number = 0;
  userGems:number =0;
  SpicyFoodCount : number = 0;
  LeafyFoodCount : number = 0;
  ColdFoodCount : number = 0;
  FluffyFoodCount : number = 0;
  BlessedFoodCount : number = 0;
  CursedFoodCount : number = 0;
  DisplayCompanionMood : number = 0;
  DisplayCompanionHunger : number = 0;

  gotoHome(){
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }

  buySomeGems(){
    this.router.navigateByUrl('/GemPurchaseShop');  // define your component where you want to go
  }
    
  ngOnInit(): void 
  {
    setInterval(()=>{
      let stringUser : string   = sessionStorage.getItem('currentUser') as string;
      let currentUser : Users = JSON.parse(stringUser);
      this.comsiniApi.HatchEgg(currentUser.username).subscribe();
    }, 3600000);
    setInterval(() => 
    {
      
      let stringUser : string = sessionStorage.getItem('currentUser') as string;
      let currentUser : Users = JSON.parse(stringUser);

      this.interApi.DecrementCompanionMoodValue(currentUser.showcaseCompanionFk as number).subscribe((res) =>
      {
        window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));
      })

      this.interApi.DecrementCompanionHungerValue(currentUser.showcaseCompanionFk as number).subscribe((res) =>
      {
        window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));
      })
    } ,60000);
  }

  needyCompanion():void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);

    this.interApi.DecrementCompanionMoodValue(currentUser.showcaseCompanionFk as number).subscribe((res) =>
      {
        window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));
      })

    this.interApi.DecrementCompanionHungerValue(currentUser.showcaseCompanionFk as number).subscribe((res) =>
      {
        window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));
      })
  }

  Logout():void{
    this.router.navigateByUrl('/login');
    window.sessionStorage.clear();    
    this.auth0.logout()
  }

  Loggedin():boolean
  {  
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    this.currentUsername = currentUser.username;
    this.currentUsernickname = sessionStorage.getItem('currentUserNickname') as string;
    
    this.SpicyFoodCount = sessionStorage.getItem('SpicyFoodCount') as unknown as number;
    this.LeafyFoodCount = sessionStorage.getItem('LeafyFoodCount') as unknown as number;
    this.ColdFoodCount = sessionStorage.getItem('ColdFoodCount') as unknown as number;
    this.FluffyFoodCount = sessionStorage.getItem('FluffyFoodCount') as unknown as number;
    this.BlessedFoodCount = sessionStorage.getItem('BlessedFoodCount') as unknown as number;
    this.CursedFoodCount = sessionStorage.getItem('CursedFoodCount') as unknown as number; //Comment here
    
    this.userEgg = currentUser.eggCount;
    this.userGold = currentUser.goldCount;
    this.userGems = currentUser.gemCount;  

    this.DisplayCompanionMood = sessionStorage.getItem('DisplayCompanionMood') as unknown as number;
    this.DisplayCompanionHunger = sessionStorage.getItem('DisplayCompanionHunger') as unknown as number;

    if(this.currentUsername)
    {
      return true;
    }
    return false;
  }

  Song1(){
    let audio = new Audio();
    audio.src = "../assets/Audio/CastlevaniaLike.mp3";
    audio.load();
    audio.play();
  }

  Song2(){
    let audio = new Audio();
    audio.src = "../assets/Audio/ADayInTokyo.mp3";
    audio.load();
    audio.play();
  }
}