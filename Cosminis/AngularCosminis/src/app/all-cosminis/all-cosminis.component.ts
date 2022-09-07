import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit, EventEmitter, Output} from '@angular/core';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
import { InteractionService } from '../services/Interaction-Api-Service/interaction.service';
import { Cosminis } from '../Models/Cosminis';
import { Router } from '@angular/router';
import { Users } from '../Models/User';

@Component({
  selector: 'app-all-cosminis',
  templateUrl: './all-cosminis.component.html',
  styleUrls: ['./all-cosminis.component.css']
})
export class AllCosminisComponent implements OnInit 
{

  constructor(private api:ComsinisApiServiceService, private router: Router, private interapi:InteractionService) { }
  showCosminis!:Promise<boolean>;
  cosminis : Cosminis[] = []
  DisplayName = new Map<number, string>();
  currentEmotion = new Map<number, string>();
  imageLib = new Map<number, string>();

  cosminis1 : Cosminis = 
  {
    companionId : 1,
    trainerId : 1,
    userFk : 1,
    speciesFk : 1,
    nickname : "Shrek",
    emotion : 100,
    mood : 100,
    hunger : 100
  }

  users : Users = 
  {
    username : 'DefaultUserName',
    password: "NoOneIsGoingToSeeThis",
    account_age : new Date(),
    eggTimer : new Date(),
    goldCount : 1,
    eggCount : 1,
    gemCount : 1,
    showcaseCompanion_fk:1,
    showcaseCompanionFk:1,
    aboutMe:"I am Boring... zzzz snoringgg",
  }

  gotoHome(){
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }

  updateCosminis() : void {
      this.api.getAllComsinis().subscribe((res) => 
      {
        this.cosminis = res;
        this.showCosminis=Promise.resolve(true);
      })
  }

  getCosminiByID(ID : number) : void 
  {
    this.api.getCosminiByID(ID).subscribe((res) => 
    {
      this.cosminis1 = res;
      this.showCosminis=Promise.resolve(true);
    })
  }

  SetShowcase(companionID: number) : void 
  {
      let stringUser : string = sessionStorage.getItem('currentUser') as string;
      this.users = JSON.parse(stringUser);
      let currentUserID : number = this.users.userId as number;

    this.interapi.SetShowcaseCompanion(currentUserID, companionID).subscribe((res) => 
    {
      if(this.users.showcaseCompanionFk != companionID)
      {
        this.users.showcaseCompanionFk = companionID;
        window.sessionStorage.setItem('currentUser', JSON.stringify(this.users));
      }
      this.showCosminis=Promise.resolve(true);
      this.cosminiDisplay();
    })
  }  

  cosminiDisplay():void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);

    this.api.getCosminiByID(currentUser.showcaseCompanionFk as number).subscribe((res) =>
        {
          window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));
          window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));
        })
  }

  getCosminiByUserID(ID : number) : void 
  {
    this.api.getCosminiByUserID(ID).subscribe((res) => 
    {
      this.cosminis = res;

      for(let i=0;i<this.cosminis.length;i++)
      {
        this.cosminis[i].speciesNickname = this.DisplayName.get(this.cosminis[i].speciesFk);
        this.cosminis[i].emotionString = this.currentEmotion.get(this.cosminis[i].emotion);
        this.cosminis[i].image = this.imageLib.get(this.cosminis[i].speciesFk);

        this.interapi.DecrementCompanionMoodValue(this.cosminis[i].companionId as number).subscribe((res) =>
        {
          window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));
        })
  
      this.interapi.DecrementCompanionHungerValue(this.cosminis[i].companionId as number).subscribe((res) =>
        {
          window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));
        })
      }

      this.showCosminis=Promise.resolve(true);
    })
  }

showCards = false;
  ngOnInit(): void 
  {
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
    this.currentEmotion.set(2, "Hostile");
    this.currentEmotion.set(3, "Angry");
    this.currentEmotion.set(4, "Distant");
    this.currentEmotion.set(5, "Inadequate");
    this.currentEmotion.set(6, "Calm");
    this.currentEmotion.set(7, "Thankful");
    this.currentEmotion.set(8, "Happy");
    this.currentEmotion.set(9, "Playful");
    this.currentEmotion.set(10, "Inspired");
    this.currentEmotion.set(11, "Blissful");

    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);

    let currentUserID : number = currentUser.userId as number;

    this.getCosminiByUserID(currentUserID);
    this.SetShowcase(currentUser.showcaseCompanionFk as number);
  }
}
