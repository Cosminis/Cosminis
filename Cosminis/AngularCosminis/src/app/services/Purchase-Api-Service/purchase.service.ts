import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../../Models/Orders';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  url : string = environment.api;

  constructor(private http: HttpClient) { }

  BuyGems(userId : number, Amount : number, cost : number) : Observable<Order> {
    return this.http.put(this.url + `Resources/Purchase/GemAdds?userId=${userId}&Amount=${Amount}&Cost=${cost}`, userId) as unknown as Observable<Order>;
  } 

  GetReceiptByUserId(userId : number) : Observable<Order[]> {
    return this.http.get(this.url + `Resources/GetReceiptByUserId?userId=${userId}`) as unknown as Observable<Order[]>;
  }
}
