import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cosminis } from '../../Models/Cosminis';

@Injectable({
  providedIn: 'root'
})
export class ComsinisApiServiceService {

  constructor(private http: HttpClient) { }
  url : string = environment.api;

  getAllComsinis() : Observable<Cosminis[]> {
    return this.http.get(this.url + `companions/GetAll`) as Observable<Cosminis[]>;
  }

  getCosminiByID(ID : number) : Observable<Cosminis> {
    return this.http.get(this.url + `companions/SearchByCompanionId?companionId=${ID}`) as Observable<Cosminis>;
  }

  getCosminiByUserID(ID : number) : Observable<Cosminis[]> 
  {
    return this.http.get(this.url + `companions/SearchByUserId?userId=${ID}`) as Observable<Cosminis[]>;
  }

  free(ID:number): Observable<Cosminis>{
    return this.http.get(this.url+'/companions/generate?userId='+ID) as Observable<Cosminis>;
  }

  setCompanionNickname(companionId : number, nickname : string) : Observable<Cosminis> {
    return this.http.put(this.url + `companions/setNickname?companionId=${companionId}&nickname=${nickname}`, companionId) as Observable<Cosminis>;
  }
  
  HatchEgg(name:string): Observable<number> {
    return this.http.get(this.url+'companions/hatch?username='+name) as unknown as Observable<number>;
  }
}
