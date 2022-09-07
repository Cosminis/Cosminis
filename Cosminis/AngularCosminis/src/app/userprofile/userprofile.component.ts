import { Component, OnInit } from '@angular/core';
import { PostSpiServicesService } from '../services/Post-api-services/post-spi-services.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { FriendsService } from '../services/Friends-api-service/friends.service';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
import { CommentService } from '../services/Comment-Service/comment.service';
import { InteractionService } from '../services/Interaction-Api-Service/interaction.service';
import { Posts } from '../Models/Posts';
import { Users } from '../Models/User';
import { Comment } from '../Models/Comments'
import { Cosminis } from '../Models/Cosminis';
import { Router } from '@angular/router';
import { Friends } from '../Models/Friends';
import { FoodElement } from '../Models/FoodInventory';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  constructor(private api:PostSpiServicesService, private router: Router, private comsiniApi:ComsinisApiServiceService, private commentApi:CommentService, private userApi:UserApiServicesService, private friendApi:FriendsService, private resourceApi: ResourceApiServicesService, private interApi:InteractionService) { }

  postComment : string = "";

  Comment : FormControl = new FormControl('', [
    Validators.required
  ]);

  commentArr : Comment[] = [];

  commentArr2 : Comment[] = [];

  speciesNickname : number = 0;

  foodChoice : number = 0;

  imageLib = new Map<number, string>();

  currentEmotion = new Map<number, string>();

  DisplayName = new Map<number, string>();

  comsiniArr : Cosminis[] = [];

  friendshipInstance : Friends =
  {
    userIdFrom : 1,
    userIdTo: 1,
    status: 'updatedStatus',
  }

  friendPending : boolean = false;
  doesExist : boolean = false;
  successfulAdd : boolean = false;

  userInstance : Users =
  {
    username : 'DefaultUserName',
    userId : 1,
    password: "NoOneIsGoingToSeeThis",
    account_age : new Date(),
    eggTimer : new Date(),
    goldCount : 1,
    eggCount : 1,
    gemCount : 1,
    showcaseCompanion_fk:1,
    showcaseCompanionFk:1,
    aboutMe:"I am Boring... zzzz snoringgg",    
  }

  displayCosmini : Cosminis = 
  {
    companionId : 0,
    trainerId : 1,
    userFk : 1,
    speciesFk : 1,
    nickname : "Shrek",
    emotion : 100,
    mood : 100,
    hunger : 100,
    image : "mystery-opponent.png"
  }  

  posts : Posts[] = []
  ownersPosts : Posts[] = []

  postInstance : Posts =
  {
    postId : 1,
    userIdFk : 1,
    content : "Shrek",    
  }

  foodDisplay : FoodElement[] = []
  friends : Friends[] = []
  users : Users[] = []
  pendingFriends : Users[] = []

  inputValue : string = "";

  gotoHome()
  {
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }

  enterUserId()
  {
    this.inputValue = (document.querySelector('.form-control') as HTMLInputElement).value;
    let inputNumber = parseInt(this.inputValue);
    this.updatePostFeed(inputNumber);
  }

  searchAndAdd(requestReceiver : string)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let searchingUser = JSON.parse(stringUser);
    
    this.searchUsers(requestReceiver);

    this.friendApi.addFriendByUsername(searchingUser.username, this.userInstance.username).subscribe((res) => 
    {
      this.friendshipInstance = res;

      if(this.friendshipInstance.status == 'Pending')
      {
        Swal.fire("Friend request sent!");
      }
    })
    this.doesExist = false;
  }

  searchUsers(searchedUser : string) : void
  {
    this.userApi.searchFriend(searchedUser).subscribe((res) =>
    {
      this.userInstance = res;


      if(this.userInstance.username != 'DefaultUserName')
      {
        this.doesExist = true;
      }
    })
  }

  searchingFriendship(searchedUser : string) : void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let searchingUser = JSON.parse(stringUser);
    
    this.searchUsers(searchedUser);

    this.friendApi.FriendsByUserIds(searchingUser.userId, this.userInstance.userId as number).subscribe((res) =>
    {
      console.log(res);
    })
  }  

  updatePostFeed(ID : number) : void 
  {
    this.api.getPostsByUserId(ID).subscribe((res) => 
    {
      res.reverse();
      this.ownersPosts = res;
      let postUser:Users;
      let userID:number;   
      for(let i=0; i<this.ownersPosts.length; i++)
      {        
        userID = this.ownersPosts[i].userIdFk;
        this.userApi.Find(userID).subscribe((res) =>
        {
          postUser = res;

          this.ownersPosts[i].posterNickname = postUser.password;
          this.displaySelfComments(this.ownersPosts[i].postId);
        })
        this.posts.splice(6, this.posts.length-6);
      }  
    })
  }

  CheckFood():boolean
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;

    let currentUser : Users = JSON.parse(stringUser);
    this.resourceApi.CheckFood(currentUser.userId as number).subscribe((res) =>
    {
      this.foodDisplay= res;
      if(this.foodDisplay.length>0)
      {
        window.sessionStorage.setItem('SpicyFoodCount', this.foodDisplay[0].foodCount as unknown as string);
        window.sessionStorage.setItem('ColdFoodCount', this.foodDisplay[1].foodCount as unknown as string);
        window.sessionStorage.setItem('LeafyFoodCount', this.foodDisplay[2].foodCount as unknown as string);
        window.sessionStorage.setItem('FluffyFoodCount', this.foodDisplay[3].foodCount as unknown as string);
        window.sessionStorage.setItem('BlessedFoodCount', this.foodDisplay[4].foodCount as unknown as string);
        window.sessionStorage.setItem('CursedFoodCount', this.foodDisplay[5].foodCount as unknown as string);
        return true;
      }
      else
      {
        window.sessionStorage.setItem('SpicyFoodCount', '0');
        window.sessionStorage.setItem('ColdFoodCount', '0');
        window.sessionStorage.setItem('LeafyFoodCount', '0');
        window.sessionStorage.setItem('FluffyFoodCount', '0');
        window.sessionStorage.setItem('BlessedFoodCount', '0');
        window.sessionStorage.setItem('CursedFoodCount', '0');
        return false;
      }
    });
    return false;
  }

  loggedIn: boolean = false;

  submitPost() : void 
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let postersId = currentUser.userId;

    this.inputValue = (document.getElementById('text') as HTMLInputElement).value;
    let postsContent = this.inputValue; 

    this.api.SubmitPostResourceGen(postsContent, postersId as number).subscribe((res) =>
    {
      this.updatePostFeed(currentUser.userId as number);
      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.CheckFood();
        //Swal.fire("Your post has been submitted, please refresh to see your post below.");
      })
    })
  }

  friendsPostFeed(username : string) : void 
  {
    this.api.getAllFriendsPosts(username).subscribe((res) => 
    {
      res.reverse();
      this.posts = res;

      let postUser:Users;
      let userID:number;
      for(let i =0; i<this.posts.length;i++)
      {
        userID = this.posts[i].userIdFk;
        this.userApi.Find(userID).subscribe((res) =>
        {
          postUser = res;

          this.posts[i].posterNickname = postUser.password;
          this.displayComments(this.posts[i].postId);
        })
        this.posts.splice(30, this.posts.length-30);
      }
    })
  }

  showAllFriends(username : string):void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let currentID = currentUser.userId;
    this.friendApi.getAcceptedFriends(username).subscribe((res) => 
    {
      this.friends = res; //this just retrieves a list of friends for now, doing the relevant logic on ngOnInit
      for(let i=0;i<this.friends.length;i++)
      {
        if(currentID==this.friends[i].userIdFrom)
        {
          this.userApi.Find(this.friends[i].userIdTo).subscribe((res) =>
          {
            this.users[i] = res;

            this.cosminiDisplay(this.users[i].username);
          })
        }
        else
        {
          this.userApi.Find(this.friends[i].userIdFrom).subscribe((res) =>
          {
            this.users[i] = res;

            this.cosminiDisplay(this.users[i].username);
          })
        }
      }
    })
  }

  acceptFriends(newFriend : string)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let acceptingUser = JSON.parse(stringUser);
    
    this.searchUsers(newFriend);

    this.friendApi.FriendsByUserIds(acceptingUser.userId, this.userInstance.userId as number).subscribe((res) =>
    {
      this.friendshipInstance = res;

      this.friendshipInstance.status = 'Accepted';

      this.friendApi.EditFriendship(acceptingUser.userId, this.userInstance.userId as number, "Accepted").subscribe((res) => 
      {           
        window.sessionStorage.setItem('currentUser', JSON.stringify(acceptingUser));
      })
      Swal.fire("Friend request accepted! Enjoy your blossoming friendship :3");     
    })
    this.doesExist = false;
  }

  displayPendingFriends():void
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let currentID = currentUser.userId;
    this.friendApi.getPendingFriends(currentID as number).subscribe((res) =>
    {
      this.friends = res;
      for(let i=0;i<this.friends.length;i++)  
      {
        this.userApi.Find(this.friends[i].userIdFrom).subscribe((res) =>
        { 
          if(res.userId != currentID)
          {
            this.pendingFriends.push(res);
          }
          
          this.friendPending = true; 
        })  
      }
    }) 
  }

  searchRelationshipsByStatus(status : string)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let searchingUser = JSON.parse(stringUser);
    
    this.friendApi.RelationshipStatusByUserId(searchingUser.userId, status).subscribe((res) =>
    {
      this.friends = res;

      for(let i=0; i<this.friends.length;i++)
      {
        if(searchingUser.userId==this.friends[i].userIdFrom)
        {
          this.userApi.Find(this.friends[i].userIdTo).subscribe((res) =>
          {
            this.pendingFriends[i] = res;         
          })
        }
        else
        {
          this.userApi.Find(this.friends[i].userIdFrom).subscribe((res) =>
          {
            this.pendingFriends[i] = res;
            this.friendPending = true;
          })
        }
      }
    })    
  }

  removeFriends(friendToRemove : string)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let removingUser = JSON.parse(stringUser);
    
    this.searchUsers(friendToRemove); 
    
    this.friendApi.FriendsByUserIds(removingUser.userId, this.userInstance.userId as number).subscribe((res) =>
    {
      this.friendshipInstance = res;

      this.friendshipInstance.status = 'Removed';

      this.friendApi.EditFriendship(removingUser.userId, this.userInstance.userId as number, "Removed").subscribe((res) => 
      {           
        window.sessionStorage.setItem('currentUser', JSON.stringify(removingUser));
      })
      Swal.fire("This friend has been removed.");      
    })
    this.doesExist = false;
  }

  blockUsers(userToBlock : string)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let blockingUser = JSON.parse(stringUser);
    
    this.searchUsers(userToBlock); 
    
    this.friendApi.FriendsByUserIds(blockingUser.userId, this.userInstance.userId as number).subscribe((res) =>
    {
      this.friendshipInstance = res;

      this.friendshipInstance.status = 'Removed';

      this.friendApi.EditFriendship(blockingUser.userId, this.userInstance.userId as number, "Removed").subscribe((res) => 
      {           
        window.sessionStorage.setItem('currentUser', JSON.stringify(blockingUser));
      })
      Swal.fire("This user has been blocked. They will no longer appear on your feed and they will not be able to add you as a friend.");    
    })   
    this.doesExist = false;
  }

  cosminiDisplay(searchedUser : string)
  {
    this.userApi.searchFriend(searchedUser).subscribe((res) => 
    {
      this.userInstance = res;
      if(this.userInstance.showcaseCompanionFk == null)
      {
        this.comsiniArr.push(this.displayCosmini);
      }
      else
      {
        this.comsiniApi.getCosminiByID(this.userInstance.showcaseCompanionFk as number).subscribe((res) =>
        {
            this.displayCosmini = res; 
            res.image = this.imageLib.get(res.speciesFk);
            res.emotionString = this.currentEmotion.get(res.emotion);
            res.speciesNickname = this.DisplayName.get(res.speciesFk);
            console.log(res);
            this.comsiniArr.push(res);
        })
      }
    })
  }

  pettingOurFriendsBaby(companionId : number)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);

    this.comsiniApi.getCosminiByID(companionId).subscribe((res) => 
    {
      let currentMood = res.mood;

      this.interApi.PetCompanion(currentUser.userId as number, companionId).subscribe((res) =>
      {
        for(let i = 0; i < this.comsiniArr.length; i++)
        {
          if(this.comsiniArr[i].companionId == res.companionId)
          {
            res.image = this.imageLib.get(res.speciesFk); 
            this.comsiniArr[i] = res;
          }
        }

        let newMood = res.mood;

        if(newMood > currentMood)
        {
          Swal.fire("Good on you for petting your friend's friend!");
        }
        else if(newMood <= currentMood)
        {
          Swal.fire("This companion was hostile! Try feeding it first next time...");
        }
      },(Error : HttpErrorResponse) => Swal.fire("It has been too soon since this companion has been last pet! Try again soon."))
    })

  }

  feedingOurFriendsBaby(foodId : number, companionId : number)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);

    this.comsiniApi.getCosminiByID(companionId).subscribe((res) => 
    {
      let currentHung = res.hunger;

      this.interApi.FeedCompanion(currentUser.userId, companionId, foodId).subscribe((res) =>
      {
        for(let i = 0; i < this.comsiniArr.length; i++)
        {
          if(this.comsiniArr[i].companionId == res.companionId)
          {
            res.image = this.imageLib.get(res.speciesFk);            
            this.comsiniArr[i] = res;
          }
        }

        let newHung = res.hunger;

        if(newHung > currentHung)
        {
          Swal.fire("Good on you for feeding your friend's friend!");
        }
        else if(newHung <= currentHung)
        {
          Swal.fire("This companion didn't like this food! Try feeding it something else next time...");
        }
      },(Error : HttpErrorResponse) => Swal.fire("It has been too soon since this companion has been last fed! Try again soon.")) 
    })   
  }  

  createComment(postId : number)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let commentersId = currentUser.userId;
    
    let postsContent : string = this.Comment.value;
    
    this.commentApi.submitComment(commentersId as number, postId, postsContent).subscribe((res) =>
    {
      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.CheckFood();
        Swal.fire("Comment submitted!");
      })
      console.log(res);
    })
  }

  displayComments(postId : number)
  {
    this.commentApi.getCommentByPostId(postId).subscribe((res) =>
    {
      res.reverse();
      this.commentArr = this.commentArr.concat(res);
      for(let i = 0; i < this.commentArr.length; i++)
      {
        this.userApi.Find(this.commentArr[i].userIdFk).subscribe((res) =>
        {
          this.commentArr[i].commenter = res.password;
        })
      }
    })
  }

  displaySelfComments(postId : number)
  {
    this.commentApi.getCommentByPostId(postId).subscribe((res) =>
    {
      res.reverse();
      this.commentArr2 = this.commentArr2.concat(res);
      for(let i = 0; i < this.commentArr2.length; i++)
      {
        this.userApi.Find(this.commentArr2[i].userIdFk).subscribe((res) =>
        {
          this.commentArr2[i].commenter = res.password;
        })
      }
    })
  }  

  ngOnInit(): void 
  {
    this.imageLib.set(3, "InfernogFire.png");
    this.imageLib.set(4, "plutofinal.png");
    this.imageLib.set(5, "15.png");
    this.imageLib.set(6, "cosmofinal.png");
    this.imageLib.set(7, "librianfinall.png");
    this.imageLib.set(8, "cancerfinal.png");

    this.currentEmotion.set(1, "Hopeless");
    this.currentEmotion.set(2, "Hostile");
    this.currentEmotion.set(3, "Angry");
    this.currentEmotion.set(4, "Distant");
    this.currentEmotion.set(5, "Inadequate");
    this.currentEmotion.set(6, "Calm");
    this.currentEmotion.set(7, "Thankful");
    this.currentEmotion.set(8, "Happy");
    this.currentEmotion.set(9, "Playful");
    this.currentEmotion.set(10, "Inspired");
    this.currentEmotion.set(11, "Blissful");

    this.DisplayName.set(3, "Infernog");
    this.DisplayName.set(4, "Pluto");
    this.DisplayName.set(5, "Buds");
    this.DisplayName.set(6, "Cosmo");
    this.DisplayName.set(7, "Librian");
    this.DisplayName.set(8, "Cancer");

    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser : Users = JSON.parse(stringUser);
    let currentUsername = currentUser.username;
    let currentUserId = currentUser.userId;
    this.updatePostFeed(currentUserId as number);
    this.friendsPostFeed(currentUsername);
    this.showAllFriends(currentUsername);
    this.displayPendingFriends();
  }
}
