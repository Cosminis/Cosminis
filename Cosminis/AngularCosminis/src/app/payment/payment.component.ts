import { Component, OnInit } from '@angular/core';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { PurchaseService } from '../services/Purchase-Api-Service/purchase.service';
import { Router } from '@angular/router';
import { Users } from '../Models/User';
import {ChangeDetectorRef} from '@angular/core';
import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { Order } from '../Models/Orders'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private router: Router, private api:ResourceApiServicesService, private purchaseApi:PurchaseService, private ref:ChangeDetectorRef) { }

  weeklySpecialQty : number = 50;
  weeklySpecialCost : number = 7.50;

  DisplayTitle = new Map<number, string>(); //number = value, string = bundle name
  DisplayCost = new Map<number, number>(); //number = value, string = cost(subtotal)

  //displaySubTotal = new Map<number, string>(); //number = cost, string = title

  orderArr : Order[] = [{orderId: 0, userIdFk: 0, cost: 0, timeOrdered: new Date()}]

  bundleTitle0 : string = "Gem Special!";
  bundleTitle1 : string = "Gem Bundle 1";
  bundleTitle2 : string = "Gem Bundle 2";
  bundleTitle3 : string = "Gem Bundle 3";
  bundleTitle4 : string = "Gem Bundle 4";
  bundleTitle5 : string = "Gem Bundle 5";

  bundleCost1 : number = 2.99;
  bundleCost2 : number = 9.99;
  bundleCost3 : number = 14.99;
  bundleCost4 : number = 19.99;
  bundleCost5 : number = 39.99;

  bundleQty1 : number = 5;
  bundleQty2 : number = 25;
  bundleQty3 : number = 35;
  bundleQty4 : number = 50;
  bundleQty5 : number = 150;

  enteredString : string = "";
  selectedCost : number = 0;

  purchaseName : string = "";
  subTotal : number = 0;
  purchaseTotal : number = 0;
  bundleQty : number = 0;

  order : Order =
  {
    orderId : 0,
    userIdFk : 0,
    cost : 0,
    timeOrdered : new Date()
  }
  
  getOrderHistory() {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.purchaseApi.GetReceiptByUserId(currentUser.userId).subscribe((res) =>
      {
        console.log(res);
        this.orderArr = res;

        for(let i=0;i<this.orderArr.length;i++)
        {
          window.sessionStorage.setItem('Order Id:', this.orderArr[i].orderId as unknown as string)
          window.sessionStorage.setItem('Cost:', this.orderArr[i].cost as unknown as string)
          window.sessionStorage.setItem('Date:', this.orderArr[i].timeOrdered as unknown as string)
        }
      })
  }

  /*
  onSelectCost(cost) {
      this.selectedCost = cost;
  }  
  */

  purchaseGems(amount : number, cost : number) {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.purchaseApi.BuyGems(currentUser.userId, amount, cost).subscribe((res) =>
    {
      this.order = res;
      console.log(currentUser);
      window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      alert("Congratulations, you just spent a lot of REAL money");
      console.log(res);
    })
  }

    
  updateTotal() : void {
    //this.purchaseName = this.DisplayTitle.get(this.enteredString);
    this.subTotal = this.selectedCost;
    this.purchaseTotal = this.bundleQty * this.subTotal;
  }
    

  ngOnInit(): void {
    /*
    this.DisplayTitle.set(1, "Gem Special");
    this.DisplayTitle.set(2, "Gem Bundle 2");
    this.DisplayTitle.set(3, "Gem Bundle 3");
    this.DisplayTitle.set(4, "Gem Bundle 4");
    this.DisplayTitle.set(5, "Gem Bundle 5");
    this.DisplayTitle.set(6, "Gem Bundle 6");

    this.DisplayCost.set(1, 7.50);
    this.DisplayCost.set(2, 2.99);
    this.DisplayCost.set(3, 9.99);
    this.DisplayCost.set(4, 19.99);
    this.DisplayCost.set(5, 19.99);
    this.DisplayCost.set(6, 39.99);
    */
    this.ref.detectChanges();
  }
  



}
