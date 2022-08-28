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

    public FriendsController(FriendServices friendServices)
    {
        _friendServices = friendServices;
    }

    [Route("/Friends/RelationshipStatusByUsername")]
    [HttpGet()]
    public ActionResult<List<Friends>> GetRelationshipStatusByUsername(string username, string status)
    {
        try
        {
            List<Friends> friendsList = this._friendServices.CheckRelationshipStatusByUsername(username, status); 
            if(friendsList.Count() > 0)
            {
                return Ok(friendsList);
            }
            else
            {
                return NotFound("This user has no relationships with this status.");
            }
    	}
        catch(UserNotFound)
        {
            return NotFound("No user with this ID exists."); 
        }
        catch(RelationshipNotFound)
        {
            return NotFound("This user has no friends!"); 
        }        
    	catch(ResourceNotFound)
        {
            return NotFound("This user has no relationships with this status."); 
        }        
    }

    [Route("/Friends/FriendsByUserIds")]
    [HttpGet()]
    public ActionResult<Friends> Get(int searchingUserId, int user2BeSearchedFor)
    {
        try
        {
            Friends friendInstance = this._friendServices.FriendsByUserIds(searchingUserId, user2BeSearchedFor); 
            if(friendInstance != null)
            {
                return Ok(friendInstance);
            }
            else
            {
                return NotFound("This user has no relationships with this status.");
            }
    	}
        catch(UserNotFound)
        {
            return NotFound("No user with this ID exists."); 
        }
        catch(RelationshipNotFound)
        {
            return NotFound("This user has no friends!"); 
        }	        	        
    	catch(ResourceNotFound)
        {
            return NotFound("These users have no established relationship."); 
        }	        
    }

    [Route("/Friends/AddFriendByUsername")]
    [HttpPost()]
    public ActionResult<Friends> Post(string userToAdd, string requestReceiver)
    {
        try
        {
            Friends friendInstance = this._friendServices.AddFriendByUsername(userToAdd, requestReceiver); 
            if(friendInstance != null)
            {
                return Ok(friendInstance);
            }
            else
            {
                return NotFound("Nah.");
            }
    	}
        catch(UserNotFound)
        {
            return NotFound("No user with this username exists."); 
        }        
    	catch(DuplicateFriends)
        {
            return Conflict("You are already friends!!"); 
        }	
    	catch(BlockedUser)
        {
            return Conflict("The information you have entered is not valid"); 
        } 
        catch(PendingFriends)
        {
            return Conflict("This friendship is already pending.");
        }         
    }

    [Route("/Friends/RelationshipStatusByUserId")]
    [HttpGet()]
    public ActionResult<List<Friends>> GetRelationshipStatusByUserId(int userId, string status)
    {
        try
        {
            List<Friends> friendsList = this._friendServices.CheckRelationshipStatusByUserId(userId, status); 
            if(friendsList.Count() > 0)
            {
                return Ok(friendsList);
            }
            else
            {
                return NotFound("This user has no relationships with this status.");
            }
    	}
        catch(UserNotFound)
        {
            return NotFound("No user with this ID exists."); 
        }        
        catch(RelationshipNotFound)
        {
            return NotFound("This user has no friends!"); 
        }        
    	catch(ResourceNotFound)
        {
            return NotFound("This information is not in our database."); 
        }        
    }

    [Route("/Friends/EditFriendshipStatus")]
    [HttpPut()]
    public ActionResult<Friends> EditFriendshipStatus(int editingUserID, int user2BeEdited, string status)
    {
        try
    	{
            Friends friendInstance = this._friendServices.EditFriendship(editingUserID, user2BeEdited, status); 
            if(friendInstance != null)
            {
                return Ok(friendInstance);
            }
            else
            {
                return NotFound("Nah.");
            }
    	}
        catch(UserNotFound)
        {
            return NotFound("No user with this ID exists."); 
        }        
        catch(RelationshipNotFound)
        {
            return NotFound("This user has no friends!"); 
        }        
    	catch(ResourceNotFound)
        {
            return NotFound("This user doesn't exist in our system."); 
        }        
    }
}
