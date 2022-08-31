import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from 'src/app/Models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
  
export class BattleService {
  
  constructor(private http: HttpClient) { }

  apiUrl: string = environment.api + 'Battle/';

  //this generate a roster from a rando user
  CreateRoster(): Observable<number[]> {
    return this.http.get(this.apiUrl) as unknown as Observable<number[]>;
  }
  //this generates a roster from a given userId
  CreateRosterWithId(OpponentID: number): Observable<number[]> {
    return this.http.get(this.apiUrl + OpponentID) as unknown as Observable<number[]>;
  }
  //this will give who one!
  BattleResult(OpponentZero: number, OpponentOne: number): Observable<boolean> {
    return this.http.get(this.apiUrl + "Result/" + OpponentOne + "/" + OpponentZero) as unknown as Observable<boolean>;
  }
  //this obtains the difficult of the battle
  DifficultyScale(RosterOne: number[], RosterTwo: number[]): Observable<number> {
    return this.http.get(this.apiUrl + "Scalar"  + RosterOne + "/" + RosterTwo) as unknown  as Observable<number>;
  }
}
