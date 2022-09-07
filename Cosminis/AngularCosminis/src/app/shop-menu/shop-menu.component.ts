import { Component, OnInit } from '@angular/core';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { Router } from '@angular/router';
import { Users } from '../Models/User';
import { FoodElement } from '../Models/FoodInventory';
import {ChangeDetectorRef} from '@angular/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-shop-menu',
  templateUrl: './shop-menu.component.html',
  styleUrls: ['./shop-menu.component.css']
})
export class ShopMenuComponent implements OnInit {

  constructor(private router: Router, private api:ResourceApiServicesService, private userApi:UserApiServicesService, private ref:ChangeDetectorRef) { }
  foodInvInstance : FoodElement[] = []
  eggQty : number = 0;
  foodQty : [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
  purchaseTotal: number = 0;
  
  eggSub: number = 0;
  chiliSub: number = 0;
  sandwhichSub: number = 0;
  saladSub: number = 0;
  marshmellowSub: number = 0;
  holySub: number = 0;
  devilSub: number = 0;

  confirmPurchase() : void {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let currentUserId = currentUser.userId as number;
    this.api.Purchase(currentUserId, this.foodQty, this.eggQty).subscribe((res) => 
    {
      this.foodInvInstance = res;

      window.sessionStorage.setItem('SpicyFoodCount', this.foodInvInstance[0].foodCount as unknown as string);
      window.sessionStorage.setItem('ColdFoodCount', this.foodInvInstance[1].foodCount as unknown as string);
      window.sessionStorage.setItem('LeafyFoodCount', this.foodInvInstance[2].foodCount as unknown as string);
      window.sessionStorage.setItem('FluffyFoodCount', this.foodInvInstance[3].foodCount as unknown as string);
      window.sessionStorage.setItem('BlessedFoodCount', this.foodInvInstance[4].foodCount as unknown as string);
      window.sessionStorage.setItem('CursedFoodCount', this.foodInvInstance[5].foodCount as unknown as string);

      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;

        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        Swal.fire("Congratulations, you just spent a lot of money");
      })
    })
}

updateTotal() : void {
  this.purchaseTotal = this.eggQty * 100;
  for(let i = 0; i < this.foodQty.length; i++) {
    this.purchaseTotal += this.foodQty[i] * 10;
  }

  this.eggSub = this.eggQty * 100;
  this.chiliSub = this.foodQty[0] * 10;
  this.sandwhichSub = this.foodQty[1] * 10;
  this.saladSub = this.foodQty[2] * 10;
  this.marshmellowSub = this.foodQty[3] * 10;
  this.holySub = this.foodQty[4] * 10;
  this.devilSub = this.foodQty[5] * 10;
}

goToGemShop(){
  this.router.navigateByUrl('/GemSpendingShop');  // define your component where you want to go
}

ngOnInit(): void {
    this.ref.detectChanges();
}

}
