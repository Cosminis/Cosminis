import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../../Models/Comments';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  url : string = environment.api;

  constructor(private http: HttpClient) { }

  submitComment(commenterId : number, postId : number, content : string) : Observable<Comment> {
    return this.http.post(this.url + `Comments/SubmitCommentEmpty?commenterID=${commenterId}&postsID=${postId}&content=${content}`, commenterId) as Observable<Comment>;  
  }

  getCommentByPostId(postId : number) : Observable<Comment[]> {
    return this.http.get(this.url + `Comments/GetComments?postId=${postId}`) as Observable<Comment[]>;  
  }

  deleteComment(commentId : number) : Observable<boolean> {
    return this.http.delete(this.url + `Comments/RemoveComment?commentId=${commentId}`) as Observable<boolean>;  
  }  
}
