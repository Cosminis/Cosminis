import { Component, OnInit} from '@angular/core';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { Users } from '../Models/User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth0: AuthService, private api:UserApiServicesService, private router: Router) { }

  currentUser : Users = 
  {
    username : 'DefaultUserName',
    password: "NoOneIsGoingToSeeThis",
    account_age : new Date(),
    eggTimer : new Date(),
    goldCount : 1,
    eggCount : 1,
    showcaseCompanion_fk:1,
    aboutMe:"I am Boring... zzzz snoringgg",
  }

  userLogin(User : Users) : void
  {
    this.api.LoginOrReggi(this.currentUser).subscribe((res) =>
    {
      this.currentUser = res;
      console.log(this.currentUser);
      window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    })
  }

  gotoHome(){
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }

  loggedIn: boolean = false;

  ngOnInit(): void 
  {
    this.auth0.user$.subscribe((userInfo) => 
    {
      console.log(userInfo);
      this.currentUser.username = userInfo?.email as string;
      if(userInfo)
      {
        this.userLogin(this.currentUser);
        this.gotoHome();
      }
    }) 
  }
}
