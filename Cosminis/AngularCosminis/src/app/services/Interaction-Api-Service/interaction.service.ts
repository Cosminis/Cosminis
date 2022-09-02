import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cosminis } from '../../Models/Cosminis';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  url : string = environment.api;  

  constructor(private http: HttpClient) { }

  SetShowcaseCompanion(UserId : number, CompanionId : number) : Observable<boolean> {
    return this.http.put(this.url + `setCompanion?userId=${UserId}&companionId=${CompanionId}`, UserId) as Observable<boolean>;
  } 

  DecrementCompanionMoodValue(companionID : number) : Observable<Cosminis> {
    return this.http.put(this.url + `/Interactions/IncrementalDecrement?companionID=${companionID}`, companionID) as Observable<Cosminis>;
  } 

  DecrementCompanionHungerValue(companionID : number) : Observable<Cosminis> {
    return this.http.put(this.url + `/Interactions/DecrementCompanionHungerValue?companionID=${companionID}`, companionID) as Observable<Cosminis>;
  } 

  PetCompanion(UserID : number, CompanionID : number) : Observable<Cosminis> {
    return this.http.put(this.url + `/Interactions/PetCompanion?userID=${UserID}&companionID=${CompanionID}`, CompanionID) as Observable<Cosminis>;
  } 

  FeedCompanion(UserID : number, CompanionID : number, foodID : number) : Observable<Cosminis> {
    return this.http.put(this.url + `/Interactions/FeedCompanion?feederId=${UserID}&companionId=${CompanionID}&foodID=${foodID}`, CompanionID) as Observable<Cosminis>;
  } 
}