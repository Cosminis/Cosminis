using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

[ApiController]
public class PostController : ControllerBase
{
	private readonly PostServices _postServices;

    public PostController(PostServices postServices)
    {
        _postServices = postServices;
    }

    [Route("/postsBy/{userId}")]
    [HttpGet]
    public ActionResult<Post> Get(int userId)
    {
        try 
        {
            List<Post> posts = _postServices.GetPostsByUserId(userId);
            return Ok(posts); 
        }
        catch(PostsNotFound)
        {
            return NotFound("There are no posts associated with that user ID"); 
        }
    }

    [Route("/viewFriendsPosts")]
    [HttpGet]
    public ActionResult<Post> Get(string username)
    {
        try
        {
            List<Post> friendsPosts = _postServices.GetAllFriendsPosts(username);
            return Ok(friendsPosts); 
        }
        catch(RelationshipNotFound)
        {
            return NotFound("That user has no friends.");    
        }
    }


    [Route("/submitPost")]
    [HttpPost]
    public ActionResult<Post> Post(string Content, int PosterID)
    {
        if (Content.Length > 600) 
        {
            return Conflict("Posts' content cannot be greater than 600 characters.");
        }
        try
        {
            Post postInfo = _postServices.SubmitPostResourceGen(Content, PosterID);
            return Created("/submitPost", postInfo);   
        }
        catch(ResourceNotFound)
        {
            return NotFound("Such a user does not exist"); 
        }   
    }
}