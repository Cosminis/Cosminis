import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from 'src/app/Models/User';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LotteryService {
  apiUrl :string= environment.api+'Lottery?';

  constructor(private http: HttpClient) { }
  
  CanPlay(gemSpent: number , userId: number): Observable<number> {
    return this.http.get<number>(this.apiUrl +"gemSpent=" + gemSpent + "&userID=" + userId) as Observable<number>;
  }
  GiveRewards(spins:number,user:Users): Observable<number []> {
    return this.http.put<number[]>(this.apiUrl+"spins="+spins, user) as Observable<number []>;
  }
}
