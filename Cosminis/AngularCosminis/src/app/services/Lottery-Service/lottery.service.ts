import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/Models/User';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {

  apiUrl = 'https://localhost:56650/Lottery?'

  constructor(private http: HttpClient) { }
  
  CanPlay(gemSpent: number , userId: number): Observable<number> {
    return this.http.get<number>(this.apiUrl +"gemSpent=" + gemSpent + "&userID=" + userId) as Observable<number>;
  }
  GiveRewards(spins:number,user:Users): Observable<Users> {
    return this.http.put<Users>(this.apiUrl+"spins="+spins, user) as Observable<Users>;
  }
}
