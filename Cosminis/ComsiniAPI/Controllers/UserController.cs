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
public class UserController : ControllerBase
{
	private readonly UserServices _userServices;

    public UserController(UserServices userServices)
    {
        _userServices = userServices;
    }

    [Route("/searchFriend")]
    [HttpGet] //I took out the ()
    public ActionResult<User> Get(string username)
    {
        try
        {
            User userInfo = _userServices.SearchFriend(username); //null checking seems pointless, because that should've already been done
            return Ok(userInfo); 
        }
        catch(UserNotFound)
        {
            return NotFound("No user with that username was found."); 
        }   
    }

    [Route("/Users/Find")]
    [HttpGet]
    public ActionResult<User> Get(int user2Check)
    {
       try
        {
            User userInfo = _userServices.SearchUserById(user2Check);
            return Ok(userInfo);
        }
        catch(UserNotFound)
        {
            return NotFound("No user with that username was found."); 
        }   
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }  
    }

    [Route("/Users/LoggiORReggi")]
    [HttpPost]
    public ActionResult<User> Post(User user2Check)
    {
        try
        {
            User userInfo = _userServices.LoginOrReggi(user2Check);
            return Created($"Users/Find/{userInfo.UserId}", userInfo);
        } 
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}