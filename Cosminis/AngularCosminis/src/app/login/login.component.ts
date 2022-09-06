import { Component, OnInit} from '@angular/core';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { FoodElement } from '../Models/FoodInventory';
import { Users } from '../Models/User';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { Cosminis } from '../Models/Cosminis';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth0: AuthService, private api:UserApiServicesService, private router: Router, private resourceApi:ResourceApiServicesService, private comsiniApi:ComsinisApiServiceService) { }

  currentUser : Users = 
  {
    username : 'DefaultUserName',
    password: "NoOneIsGoingToSeeThis",
    account_age : new Date(),
    eggTimer : new Date(),
    goldCount : 1,
    eggCount : 1,
    gemCount : 1,
    showcaseCompanion_fk:1,
    aboutMe:"I am Boring... zzzz snoringgg",
  }

  foodDisplay : FoodElement[] = []

  userLogin(User : Users) : void
  {
    this.api.LoginOrReggi(this.currentUser).subscribe((res) =>
    {
      this.currentUser = res;
      window.sessionStorage.setItem('currentUserNickname', this.currentUser.password as string);
      window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.CheckFood();
      this.cosminiDisplay();
    })
  }

  gotoHome(){
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }

  cosminiDisplay():void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);

    this.comsiniApi.getCosminiByID(currentUser.showcaseCompanionFk as number).subscribe((res) =>
        {
          window.sessionStorage.setItem('DisplayCompanionMood', JSON.stringify(res.mood));
          window.sessionStorage.setItem('DisplayCompanionHunger', JSON.stringify(res.hunger));
        })
  }

  CheckFood():boolean
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    this.resourceApi.CheckFood(currentUser.userId as number).subscribe((res) =>
    {
      this.foodDisplay= res;
      if(this.foodDisplay.length>0)
      {
        window.sessionStorage.setItem('SpicyFoodCount', this.foodDisplay[0].foodCount as unknown as string);
        window.sessionStorage.setItem('ColdFoodCount', this.foodDisplay[1].foodCount as unknown as string);
        window.sessionStorage.setItem('LeafyFoodCount', this.foodDisplay[2].foodCount as unknown as string);
        window.sessionStorage.setItem('FluffyFoodCount', this.foodDisplay[3].foodCount as unknown as string);
        window.sessionStorage.setItem('BlessedFoodCount', this.foodDisplay[4].foodCount as unknown as string);
        window.sessionStorage.setItem('CursedFoodCount', this.foodDisplay[5].foodCount as unknown as string);
        return true;
      }
      else
      {
        window.sessionStorage.setItem('SpicyFoodCount', '0');
        window.sessionStorage.setItem('ColdFoodCount', '0');
        window.sessionStorage.setItem('LeafyFoodCount', '0');
        window.sessionStorage.setItem('FluffyFoodCount', '0');
        window.sessionStorage.setItem('BlessedFoodCount', '0');
        window.sessionStorage.setItem('CursedFoodCount', '0');
        return false;
      }
    });
    return false;
  }

  loggedIn: boolean = false;

  ngOnInit(): void 
  {
    this.auth0.user$.subscribe((userInfo) => 
    {
      this.currentUser.username = userInfo?.email as string;
      this.currentUser.password = userInfo?.nickname as string;
      if(userInfo)
      {
        window.sessionStorage.setItem('currentUserNickname', userInfo.nickname as string);
        this.userLogin(this.currentUser);
        this.gotoHome();
      }
    }) 
  }
}
