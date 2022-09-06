import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../Models/User';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';

@Component({
  selector: 'app-select-battle',
  templateUrl: './select-battle.component.html',
  styleUrls: ['./select-battle.component.css']
})
export class SelectBattleComponent implements OnInit {

  constructor(private router: Router, private UserService: UserApiServicesService) { }

  gotoBattleMenu(){
    this.router.navigateByUrl('/Battle/Menu');  // goes to the battle menu screen
  }

  BattleFriend() {
    window.sessionStorage.setItem("BattleMode", "Friend");
    this.router.navigateByUrl('/Battle/Menu');  // goes to the battle menu screen
  }

  BattleRandom() {
    window.sessionStorage.setItem("BattleMode", "Random");
    this.router.navigateByUrl('/Battle/Menu');  // goes to the battle menu screen
  }

  BattleBoss() {
    window.sessionStorage.setItem("BattleMode", "Boss");
    window.sessionStorage.setItem("BossId", "5");
    this.router.navigateByUrl('/Battle/Menu');
  }

  ngOnInit(): void {
  let stringUser: string = sessionStorage.getItem('currentUser') as string;
  let currentUser: Users = JSON.parse(stringUser);

  this.UserService.LoginOrReggi(currentUser).subscribe((res) => {
    currentUser = res;
    window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  });
  }

}
