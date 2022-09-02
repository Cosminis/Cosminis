using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class PostServices
{
	private readonly IPostDAO _postRepo;
	private readonly IResourceGen _resourceRepo;
    private readonly IFriendsDAO _friendsRepo;
    private readonly IUserDAO _userRepo;

    public PostServices(IPostDAO postRepo, IResourceGen resourceRepo, IFriendsDAO friendsRepo, IUserDAO userRepo)
    {
        _postRepo = postRepo;
        _resourceRepo = resourceRepo;
        _friendsRepo = friendsRepo;
        _userRepo = userRepo;
    }

    public Post SubmitPostResourceGen(string Content, int PosterID)
    {
        Post newPost = new Post()
        {
            Content = Content,
            UserIdFk = PosterID
        };
    	User shellUser = new User();
    	shellUser.UserId = newPost.UserIdFk; //this sets the shellUser's id to the post's useridkfk, now shellUser actually has some useful info (a user ID) 

    	int Weight = 30;
        int goldToAdd = 0;
    	int charCount = newPost.Content.Length;  //gets the length of each post's content

        if (charCount <= 10) //linear scaling
        {
        	Weight = 20; //exponential scaling
        }
        else if (charCount <= 50)
        {
        	Weight = 40;
        }
        else if (charCount <= 90)
        {
        	Weight = 80;
        }
    	else if (charCount <= 130)
    	{
    		Weight = 160;
    	}
        else if (charCount > 140)
    	{
    		Weight = 320;
    	}

        if (charCount <= 10)
        {
        	goldToAdd = 0;
        }
        else if (charCount <= 80)
        {
        	goldToAdd = 5;
        }
    	else if (charCount > 80)
    	{
    		goldToAdd = 10;
    	}

        if(!_resourceRepo.AddFood(shellUser, Weight))
        {
            throw new ResourceNotFound("Something had gone wrong when adding food, your companion boutta starve");
        }

        try
        {
            _resourceRepo.AddGold(shellUser, goldToAdd);
        }
        catch(Exception)
        {
            throw;
        }
        
        return _postRepo.SubmitPost(newPost);
    }

    public List<Post> GetPostsByUserId(int userId)
    {
        List<Post> posts = _postRepo.GetPostsByUserId(userId);
        if (posts.Count < 1) 
        {
            throw new PostsNotFound();
        }
        return posts; 
    }

    public List<Post> GetPostsByUsername(string username)
    {
        List<Post> posts = _postRepo.GetPostsByUsername(username);
        if (posts.Count < 1) 
        {
            throw new PostsNotFound();
        }
        return posts;
    }

    public List<Post> GetAllFriendsPosts(string username)
    {
        try
        {
            List<Friends> relationships = _friendsRepo.CheckRelationshipStatusByUsername(username, "Accepted"); //this stores all the accepted relationships of that user
            User userInfo = _userRepo.GetUserByUserName(username);

            List<Post> friendsPosts = new List<Post>();
            for (int i = 0; i < relationships.Count; i++) //we are iterating through all possible relationships
            {
                if (relationships[i].UserIdTo == userInfo.UserId)
                {
                    friendsPosts = friendsPosts.Concat(_postRepo.GetPostsByUserId(relationships[i].UserIdFrom)).ToList(); //this returns a list of posts for the users friend
                }
                else
                {
                    friendsPosts = friendsPosts.Concat(_postRepo.GetPostsByUserId(relationships[i].UserIdTo)).ToList(); //this returns a list of posts for the users friend
                    //Concat stiches the two Lists together
                }
            }

            friendsPosts = friendsPosts.OrderBy(o=>o.PostId).ToList();

            return friendsPosts;
        }
        catch(ResourceNotFound)
        {
            throw new RelationshipNotFound();
        }
    }
}