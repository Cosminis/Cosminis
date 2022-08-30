import { Component, OnInit } from '@angular/core';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { Router } from '@angular/router';
import { Users } from '../Models/User';
import { FoodElement } from '../Models/FoodInventory';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-gem-spending-menu',
  templateUrl: './gem-spending-menu.component.html',
  styleUrls: ['./gem-spending-menu.component.css']
})
export class GemSpendingMenuComponent implements OnInit {

  constructor(private router: Router, private api:ResourceApiServicesService, private userApi:UserApiServicesService, private ref:ChangeDetectorRef) { }
  foodInvInstance : FoodElement[] = []
  eggQty : number = 0;
  foodQty : [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
  purchaseTotal : number = 0;


  confirmPurchase() : void 
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let currentUserId = currentUser.userId as number;
    this.api.PurchaseWithGems(currentUserId, this.foodQty, this.eggQty).subscribe((res) => 
    {
      this.foodInvInstance = res;
      console.log(res);
      window.sessionStorage.setItem('SpicyFoodCount', this.foodInvInstance[0].foodCount as unknown as string);
      window.sessionStorage.setItem('ColdFoodCount', this.foodInvInstance[1].foodCount as unknown as string);
      window.sessionStorage.setItem('LeafyFoodCount', this.foodInvInstance[2].foodCount as unknown as string);
      window.sessionStorage.setItem('FluffyFoodCount', this.foodInvInstance[3].foodCount as unknown as string);
      window.sessionStorage.setItem('BlessedFoodCount', this.foodInvInstance[4].foodCount as unknown as string);
      window.sessionStorage.setItem('CursedFoodCount', this.foodInvInstance[5].foodCount as unknown as string);
      console.log(this.foodInvInstance);
      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;
        console.log(currentUser);
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert("Congratulations, you just spent a lot of Gems");
      })
    })
  }

  updateTotal() : void 
  {
    this.purchaseTotal = this.eggQty * 100;  // This value needs to be updated
    for(let i = 0; i < this.foodQty.length; i++) 
    {
      this.purchaseTotal += this.foodQty[i] * 10;  // this value needs to be updated
    }
  }

  gotoShop(){
    this.router.navigateByUrl('/shop');  // define your component where you want to go
  }

  ngOnInit(): void {
  }

}
