/*using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

[ApiController]
public class LikeController : ControllerBase
{
	private readonly LikeServices _likeServices;

    public LikeController(LikeServices likeServices)
    {
        _likeServices = likeServices;
    }
    
    [Route("/Likes/RemoveLikes")]
    [HttpPut]
    public ActionResult<bool> RemoveLikes(int UserID, int PostID)
    {
        try 
        {
            _likeServices.RemoveLikes(UserID, PostID);
            return Ok(true); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("Either the user or the post does not exist");
        }
        catch(LikeDoesNotExist) //Now different exceptions have different behaviours 
        {
            return NotFound("This user didn't like this post in the first place");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Route("/Likes/AddLikes")]
    [HttpPut]
    public ActionResult<bool> AddLikes(int UserID, int PostID)
    {
        try 
        {
            _likeServices.AddLikes(UserID, PostID);
            return Ok(true); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("Either the user or the post does not exist");
        }
        catch(DuplicateLikes) //so David can STFU about it
        {
            return Conflict("This post has already been liked by this user");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Route("/Likes/GetLikes")]
    [HttpGet]
    public ActionResult<int> LikeCount(int PostID)
    {
        try 
        {
            int likes = _likeServices.LikeCount(PostID);
            return Ok(likes); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("Either the user or the post does not exist");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}*/