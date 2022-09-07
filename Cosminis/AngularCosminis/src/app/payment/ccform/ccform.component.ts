import { Component, Input, OnInit } from '@angular/core';
import { ResourceApiServicesService } from '../../services/Resource-Api-Service/resource-api-service.service';
import { UserApiServicesService } from '../../services/User-Api-Service/user-api-services.service';
import { PurchaseService } from '../../services/Purchase-Api-Service/purchase.service';
import { Router } from '@angular/router';
import { Order } from '../../Models/Orders';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-ccform',
  templateUrl: './ccform.component.html',
  styleUrls: ['./ccform.component.css']
})
export class CcformComponent implements OnInit {

  constructor(private router: Router, private api:ResourceApiServicesService, private purchaseApi:PurchaseService, private userApi:UserApiServicesService) { }

  isValid : boolean = false;

  ccnum : FormControl = new FormControl('', [
    Validators.required
  ]);

  paymentForm = new FormGroup(
  {
    'fname': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
    'address' : new FormControl('', [Validators.required]),
    'city' : new FormControl('', [Validators.required]),
    'state' : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    'cardname' : new FormControl('', [Validators.required]),
    'cardNumber': new FormControl('', [Validators.required, Validators.minLength(15), Validators.maxLength(16)]),
    'cardMonth': new FormControl('', [Validators.required]),
    'cardYear': new FormControl('', [Validators.required]),
    'cvv': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]),
    'zipCode': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)])
  });

  get fname() { return this.paymentForm.get('fname'); }
  get address() { return this.paymentForm.get('address'); }
  get city() { return this.paymentForm.get('city'); }
  get state() { return this.paymentForm.get('state'); }
  get cardname() { return this.paymentForm.get('cardname'); }
  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardMonth() { return this.paymentForm.get('cardMonth'); }
  get cardYear() { return this.paymentForm.get('cardYear'); }
  get cvv() { return this.paymentForm.get('cvv'); }
  get zipCode() { return this.paymentForm.get('zipCode'); }

  @Input() amount = 0;

  @Input() cost = 0;

  //@Input() sTotal = 0;  I will keep these in case validation fails later for extra measures, but it seems to be working now.

  //@Input() bCount = 0;

  order : Order =
  {
    orderId : 0,
    userIdFk : 0,
    cost : 0,
    timeOrdered : new Date()
  }

  ngOnInit(): void {
    if(this.amount == 0 || this.cost == 0 || this.amount == null || this.cost == null)
    {
      this.isValid = true;
    }
  }

  validityChecker()
  {
    if(this.amount == 0 || this.cost == 0 || this.amount == null || this.cost == null)
    {
      this.isValid = true;
    }
  }

  purchaseGems(amount : number, cost : number) {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.validityChecker();

    this.purchaseApi.BuyGems(currentUser.userId, amount, cost).subscribe((res) =>
    {
      this.order = res;
      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        Swal.fire("Congratulations, you just spent a lot of REAL money");
      })
    })
  }
}