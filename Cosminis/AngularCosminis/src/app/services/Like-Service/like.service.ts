import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../../Models/User';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  url : string = environment.api;

  constructor(private http: HttpClient) { }

  removeLikes(userId : number, postId : number) : Observable<boolean> {
    return this.http.put(this.url + `RemoveLikes?UserID=${userId}&PostID=${postId}`, userId) as Observable<boolean>;  
  }

  addLikes(userId : number, postId : number) : Observable<boolean> {
    return this.http.put(this.url + `Likes/AddLikes?UserID=${userId}&PostID=${postId}`, userId) as Observable<boolean>;  
  }

  getLikes(postId : number) : Observable<number> {
    return this.http.get(this.url + `Likes/Likes/GetLikes?PostID=${postId}`) as Observable<number>;  
  }
}
