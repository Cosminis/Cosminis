import { Component, getDebugNode, OnInit } from '@angular/core';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { PurchaseService } from '../services/Purchase-Api-Service/purchase.service';
import { Router } from '@angular/router';
import { Users } from '../Models/User';
import {ChangeDetectorRef} from '@angular/core';
import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { Order } from '../Models/Orders'
import { Bundle } from '../Models/Bundle';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private router: Router, private api:ResourceApiServicesService, private purchaseApi:PurchaseService, private ref:ChangeDetectorRef) { }

  amount = "gemTotal";
  cost = "purchaseTotal";

  bundle0 : Bundle =
  {
    bundleType: 'Gem Special!',
    gemQuantity: 50,
    bundleCost: 7.5,
  }

  bundle1 : Bundle =
  {
    bundleType: 'Gem Bundle 1!',
    gemQuantity: 2,
    bundleCost: 2.99,
  }
  
  bundle2 : Bundle =
  {
    bundleType: 'Gem Bundle 2!',
    gemQuantity: 20,
    bundleCost: 9.99,
  }
  
  bundle3 : Bundle =
  {
    bundleType: 'Gem Bundle 3!',
    gemQuantity: 35,
    bundleCost: 14.99,
  }

  bundle4 : Bundle =
  {
    bundleType: 'Gem Bundle 4!',
    gemQuantity: 50,
    bundleCost: 19.99,
  }
  
  bundle5 : Bundle =
  {
    bundleType: 'Gem Bundle 5!',
    gemQuantity: 150,
    bundleCost: 39.99,
  }

  purchaseArr : [] = []

  bundleInstance : Bundle =
  {
    bundleType: '',
    gemQuantity: 0,
    bundleCost: 0
  }

  orderArr : Order[] = [{orderId: 0, userIdFk: 0, cost: 0, timeOrdered: new Date()}]

  bundleArr : [Bundle, Bundle, Bundle, Bundle, Bundle, Bundle] = [this.bundle0, this.bundle1, this.bundle2, this.bundle3, this.bundle4, this.bundle5]

  enteredString : string = "";
  subTotal : number = 0;
  purchaseTotal : number = 0;
  bundleQty : number = 0;
  totalQty : number = 0;
  gemQty : number = 0;
  gemTotal : number = 0;
  
  costsEntered : boolean = false;

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
        this.orderArr = res;

        for(let i=0;i<this.orderArr.length;i++)
        {
          window.sessionStorage.setItem('Order Id:', this.orderArr[i].orderId as unknown as string)
          window.sessionStorage.setItem('Cost:', this.orderArr[i].cost as unknown as string)
          window.sessionStorage.setItem('Date:', this.orderArr[i].timeOrdered as unknown as string)
        }
      })
  }

  purchaseGems(amount : number, cost : number) {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.purchaseApi.BuyGems(currentUser.userId, amount, cost).subscribe((res) =>
    {
      this.order = res;
      window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      Swal.fire("Congratulations, you just spent a lot of REAL money");
    })
  }
  
  getBundleCost(bundleType : string, bundleCost : number, bundleGemQty : number)
  {   
    this.enteredString = bundleType;
    this.subTotal = bundleCost;
    this.gemQty = bundleGemQty;

    this.gemTotal = this.gemQty * this.totalQty;
    this.purchaseTotal = this.totalQty * this.subTotal;   
  }
  
  getQuantity(bundleQty : number)
  {
    this.totalQty =  bundleQty;
  }

  
  updateSubTotal(bundleCost : number, bundleQty : number)
  {
    this.totalQty = bundleQty;
    this.subTotal = bundleCost;

    if(this.totalQty != null && this.subTotal != null)
    {
      this.costsEntered = true;
    }

    this.gemTotal = this.gemQty * this.totalQty;
    this.purchaseTotal = this.totalQty * this.subTotal;   
  }

  ngOnInit(): void {
    this.ref.detectChanges();
  }
  
}