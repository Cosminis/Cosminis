import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../../Models/User';
import { FoodElement } from '../../Models/FoodInventory';

@Injectable({
  providedIn: 'root'
})
export class ResourceApiServicesService {
  url : string = environment.api;

  constructor(private http: HttpClient) { }

  Purchase(userId : number, fQty : number[], eQty : number) : Observable<FoodElement[]> {
    return this.http.put(this.url + `Resources/Purchase?userId=${userId}&eggQty=${eQty}`, fQty) as unknown as Observable<FoodElement[]>;
    //use username instead of userid? how does this work since user model doesn't have userId?
  } 

  PurchaseWithGems(userId : number, fQty : number[], eQty : number, goldQty : number) : Observable<FoodElement[]> {
    return this.http.put(this.url + `Resources/Purchase/Gems?userId=${userId}&eggQty=${eQty}&Gold=${goldQty}`, fQty) as unknown as Observable<FoodElement[]>;
   // To be connected with the PurchaseWithGems on the backend
  } 

  CheckFood(userId : number) : Observable<FoodElement[]> {
    return this.http.get(this.url + `foodsUnder/?userId=${userId}`) as unknown as Observable<FoodElement[]>;
    //use username instead of userid? how does this work since user model doesn't have userId?
  } 

  AddGold(userID: number, amount: number):Observable<boolean>
  {
    return this.http.put(this.url + `Resources/AddGold?UserId=${userID}&Amount=${amount}`, amount) as unknown as Observable<boolean>;
  }
}
