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
  gemQty : [number, number, number, number, number] = [5, 20, 35, 75, 150];
  
  orderArr : Order[] = [{orderId: 0, userIdFk: 0, cost: 0, TimeOrdered: new Date()}]

  order : Order =
  {
    orderId : 0,
    userIdFk : 0,
    cost : 0,
    TimeOrdered : new Date()
  }
  
  ngOnInit(): void {

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
          //this.orderArr[i].orderId = this.order.orderId;
          window.sessionStorage.setItem('Order Id:', this.orderArr[i].orderId as unknown as string)
          //this.orderArr[i].userIdFk = this.order.userIdFk; you know who the user is....
          //window.sessionStorage.setItem('user Id:', this.orderArr[i].orderId)
          //this.orderArr[i].cost = this.order.cost;
          window.sessionStorage.setItem('Cost:', this.orderArr[i].cost as unknown as string)
          //this.orderArr[i].TimeOrdered = this.order.date;
          window.sessionStorage.setItem('Date:', this.orderArr[i].TimeOrdered as unknown as string)
        }
      })
  }


}
