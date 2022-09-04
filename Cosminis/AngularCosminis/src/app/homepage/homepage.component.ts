import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
import { Users } from '../Models/User';
import { Cosminis } from '../Models/Cosminis';
import { InteractionService } from '../services/Interaction-Api-Service/interaction.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private router: Router, private comsiniApi:ComsinisApiServiceService, private interApi:InteractionService) { }

  displayCosmini : Cosminis = 
  {
    companionId : 1,
    trainerId : 1,
    userFk : 1,
    speciesFk : 1,
    nickname : "Shrek",
    emotion : 100,
    mood : 100,
    hunger : 100,
    image : "mystery-opponent.png"
  }

  cosminiLoader : boolean = false;

  foodChoice : number = 0;

  imageLib = new Map<number, string>();

  ngOnInit(): void 
  {
    this.imageLib.set(3, "InfernogFire.png");
    this.imageLib.set(4, "plutofinal.png");
    this.imageLib.set(5, "15.png");
    this.imageLib.set(6, "cosmofinal.png");
    this.imageLib.set(7, "librianfinall.png");
    this.imageLib.set(8, "cancerfinal.png");

    console.log(this.displayCosmini);

    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);

    do 
    {
      stringUser = sessionStorage.getItem('currentUser') as string;

      currentUser = JSON.parse(stringUser);
      
      console.log(currentUser)

      this.cosminiDisplay();
    }
    while(!currentUser);

    this.cosminiDisplay();
    console.log(this.cosminiLoader);

    //setInterval(this.smellingHandler, 5000, "my text");
  }

  feedingOurBaby(foodId : number){
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.interApi.FeedCompanion(currentUser.userId, currentUser.showcaseCompanionFk, foodId).subscribe((res) =>
      {
        window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));
      })    
  }

  pettingOurBaby(){
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.interApi.PetCompanion(currentUser.userId, currentUser.showcaseCompanionFk).subscribe((res) =>
      {
        window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));
      })
  }

  smellingHandler(){ //many people have smelt this
    let audio = new Audio();
    audio.src = "../assets/Audio/1.mp3";
    audio.load();
    audio.play();
  }

  gotoBattleSelect(){
    this.router.navigateByUrl('/Battle/Selection');  // goes to the battle selection screen
  }

  GoAway(){
    this.router.navigateByUrl('/Go');  // define your component where you want to go
  }

  GoBabies(){
    this.router.navigateByUrl('/MyBabies');  // define your component where you want to go
  }

  gotoLottery(){
    this.router.navigateByUrl('/lottery');  // Goes to lottey roulette wheel
  }
  gotoUserProfile(){
    this.router.navigateByUrl('/userprofile');  // define your component where you want to go
  }

  gotoShop(){
    this.router.navigateByUrl('/shop');  // define your component where you want to go
  }
  
  cosminiDisplay():void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    
    console.log(currentUser);
    this.comsiniApi.getCosminiByUserID(currentUser.userId as number).subscribe({
      next: (res)=>{}, 
      error:(err)=>{ if(err.stauts===404){this.comsiniApi.free(currentUser.userId as number).subscribe();}}})
    this.comsiniApi.getCosminiByID(currentUser.showcaseCompanionFk as number).subscribe((res) =>
        {
          this.cosminiLoader = true;
          console.log(this.cosminiLoader);
          res.image = this.imageLib.get(res.speciesFk);
          this.displayCosmini = res;
        })
        
  } 

  display() : boolean
  {
    return this.cosminiLoader;
    console.log(this.displayCosmini);
  }
}
