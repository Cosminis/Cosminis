import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-battle',
  templateUrl: './select-battle.component.html',
  styleUrls: ['./select-battle.component.css']
})
export class SelectBattleComponent implements OnInit {

  constructor(private router: Router) { }

  gotoBattleMenu(){
    this.router.navigateByUrl('/Battle/Menu');  // goes to the battle menu screen
  }

  ngOnInit(): void {
  }

}
