import { Component, Input, OnInit } from '@angular/core';
import { ResourceApiServicesService } from '../../services/Resource-Api-Service/resource-api-service.service';
import { UserApiServicesService } from '../../services/User-Api-Service/user-api-services.service';
import { PurchaseService } from '../../services/Purchase-Api-Service/purchase.service';
import { Router } from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import { Order } from '../../Models/Orders'
import { Bundle } from '../../Models/Bundle';

@Component({
  selector: 'app-ccform',
  templateUrl: './ccform.component.html',
  styleUrls: ['./ccform.component.css']
})
export class CcformComponent implements OnInit {

  constructor(private router: Router, private api:ResourceApiServicesService, private purchaseApi:PurchaseService, private userApi:UserApiServicesService) { }

  @Input() amount = 0;

  @Input() cost = 0;

  order : Order =
  {
    orderId : 0,
    userIdFk : 0,
    cost : 0,
    timeOrdered : new Date()
  }

  ngOnInit(): void {
    console.log(this.amount, this.cost);
  }

  purchaseGems(amount : number, cost : number) {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.purchaseApi.BuyGems(currentUser.userId, amount, cost).subscribe((res) =>
    {
      this.order = res;
      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert("Congratulations, you just spent a lot of REAL money");
      })
    })
  }
}
