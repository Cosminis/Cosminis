import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
import { Users } from '../Models/User';
import { Cosminis } from '../Models/Cosminis';
import { InteractionService } from '../services/Interaction-Api-Service/interaction.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
  
export class HomepageComponent implements OnInit {

  constructor(private router: Router, private comsiniApi:ComsinisApiServiceService, private interApi:InteractionService, private UserService: UserApiServicesService) { }

  enteredName : string = "FluffyCloud69"

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

  
  feedingOurBaby(foodId : number){
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);
    
    this.comsiniApi.getCosminiByID(currentUser.showcaseCompanionFk).subscribe((res) => 
    {
      let currentMood = res.mood;

      this.interApi.FeedCompanion(currentUser.userId, currentUser.showcaseCompanionFk, foodId).subscribe((res) =>
      {
        let newMood = res.mood;
        window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));

        if(newMood > currentMood)
        {
          Swal.fire("Your companion LOVED its dinner!");
        }
        else if(newMood <= currentMood)
        {
          Swal.fire("This companion really didn't like this food. Try feeding it something else next time...");
        }
      },(Error : HttpErrorResponse) => Swal.fire("It has been too soon since this companion has been last fed! Try again soon."))
    })
  }
  
  pettingOurBaby(){
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.comsiniApi.getCosminiByID(currentUser.showcaseCompanionFk).subscribe((res) => 
    {
      let currentHung = res.mood;

      this.interApi.PetCompanion(currentUser.userId, currentUser.showcaseCompanionFk).subscribe((res) =>
      {
        let newHung = res.mood;
        window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));

        if(newHung > currentHung)
        {
          Swal.fire("uwu! Your companion was so happy to be pet!");
        }
        else if(newHung <= currentHung)
        {
          Swal.fire("Your companion was hostile! Try feeding it first next time...");
        }
      },(Error : HttpErrorResponse) => Swal.fire("It has been too soon since this companion has been last pet! Try again soon."))
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
    this.comsiniApi.getCosminiByUserID(currentUser.userId as number).subscribe({
      next: (res)=>{}, 
      error:(err)=>{ if(err.stauts===404){this.comsiniApi.free(currentUser.userId as number).subscribe();}}})
      this.comsiniApi.getCosminiByID(currentUser.showcaseCompanionFk as number).subscribe((res) =>
      {
        this.cosminiLoader = true;
        res.image = this.imageLib.get(res.speciesFk);
        this.displayCosmini = res;
      })
    } 
    
    setNickname(enteredName : string) : void
    {
      let stringUser : string = sessionStorage.getItem('currentUser') as string;
      let currentUser : Users = JSON.parse(stringUser);
      
      this.comsiniApi.setCompanionNickname(currentUser.showcaseCompanionFk as number, enteredName).subscribe((res) =>
      {
        console.log(res);
      })
  } 
  
    ngOnInit(): void 
    {
      let stringUser: string = sessionStorage.getItem('currentUser') as string;
      let currentUser: Users = JSON.parse(stringUser);

      this.UserService.LoginOrReggi(currentUser).subscribe((res) => {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      });

      this.imageLib.set(3, "InfernogFire.png");
      this.imageLib.set(4, "plutofinal.png");
      this.imageLib.set(5, "15.png");
      this.imageLib.set(6, "cosmofinal.png");
      this.imageLib.set(7, "librianfinall.png");
      this.imageLib.set(8, "cancerfinal.png");
  
      this.cosminiDisplay();
      //setInterval(this.smellingHandler, 5000, "my text");
    }
  }
  