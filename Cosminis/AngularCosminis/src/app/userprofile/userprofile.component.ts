import { Component, OnInit } from '@angular/core';
import { PostSpiServicesService } from '../services/Post-api-services/post-spi-services.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { FriendsService } from '../services/Friends-api-service/friends.service';
import { ResourceApiServicesService } from '../services/Resource-Api-Service/resource-api-service.service';
import { Posts } from '../Models/Posts';
import { Users } from '../Models/User';
import { Router } from '@angular/router';
import { Friends } from '../Models/Friends';
import { FoodElement } from '../Models/FoodInventory';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  constructor(private api:PostSpiServicesService, private router: Router, private userApi:UserApiServicesService, private friendApi:FriendsService, private resourceApi: ResourceApiServicesService) { }

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
    showcaseCompanion_fk:1,
    showcaseCompanionFk:1,
    aboutMe:"I am Boring... zzzz snoringgg",    
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
    
    console.log(this.inputValue);
  }

  searchAndAdd(requestReceiver : string)
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let searchingUser = JSON.parse(stringUser);
    
    this.searchUsers(requestReceiver);

    this.friendApi.addFriendByUsername(searchingUser.username, this.userInstance.username).subscribe((res) => 
    {
      this.friendshipInstance = res;
      console.log(this.friendshipInstance);

      if(this.friendshipInstance.status == 'Pending')
      {
        console.log(res);
        alert("Friend request sent!");
        console.log(alert);
      }
    })
    this.doesExist = false;
  }

  searchUsers(searchedUser : string) : void
  {
    this.userApi.searchFriend(searchedUser).subscribe((res) =>
    {
      this.userInstance = res;
      console.log(this.userInstance);

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
          console.log(postUser);
          this.ownersPosts[i].posterNickname = postUser.password;
        })
      }  
    })
  }

  CheckFood():boolean
  {
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    console.log(stringUser);
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
      this.userApi.LoginOrReggi(currentUser).subscribe((res) =>
      {
        currentUser = res;
        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.CheckFood();
        alert("Your post has been submitted, please refresh to see your post below.");
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
          console.log(postUser);
          this.posts[i].posterNickname = postUser.password;
        })
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
            console.log(this.users[i].password);
          })
        }
        else
        {
          this.userApi.Find(this.friends[i].userIdFrom).subscribe((res) =>
          {
            this.users[i] = res;
            console.log(this.users[i].password);
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
      alert("Friend request accepted! Enjoy your blossoming friendship :3");
      console.log(alert);      
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
      console.log(res);
      for(let i=0; i<this.friends.length;i++)
      {
        if(searchingUser.userId==this.friends[i].userIdFrom)
        {
          this.userApi.Find(this.friends[i].userIdTo).subscribe((res) =>
          {
            this.pendingFriends[i] = res;         
            console.log(this.pendingFriends[i].username);
          })
        }
        else
        {
          this.userApi.Find(this.friends[i].userIdFrom).subscribe((res) =>
          {
            this.pendingFriends[i] = res;
            this.friendPending = true;
            console.log(this.pendingFriends[i].username);
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
      alert("This friend has been removed.");
      console.log(alert);      
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
      alert("This user has been blocked. They will no longer appear on your feed and they will not be able to add you as a friend.");
      console.log(alert);      
    })   
    this.doesExist = false;
  }

  ngOnInit(): void 
  {
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
