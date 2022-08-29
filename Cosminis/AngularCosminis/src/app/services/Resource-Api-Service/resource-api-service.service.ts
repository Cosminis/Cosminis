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

  CheckFood(userId : number) : Observable<FoodElement[]> {
    return this.http.get(this.url + `foodsUnder/${userId}`) as unknown as Observable<FoodElement[]>;
    //use username instead of userid? how does this work since user model doesn't have userId?
  } 
}
