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
public class FriendsController : ControllerBase
{
	private readonly FriendServices _friendServices;

    public InteractionController(FriendServices friendServices)
    {
        _friendServices = friendServices;
    }

    [Route("/GetAcceptedFriends")]
    [HttpGet()]
    public ActionResult<List<Friends>> Get(string username)
    {
        List<Friends> friendsList = this._friendsService.CheckRelationshipStatusByUsername(username, "Accepted"); 
        if(friendsList.Count() > 0)
        {
            return Ok(friendsList);
        }
        else
        {
            return NotFound("This user has no relationships with this status.");
        }
    }

}
