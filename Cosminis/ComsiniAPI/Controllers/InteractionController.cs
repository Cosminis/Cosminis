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
public class InteractionController : ControllerBase
{
	private readonly InteractionService _interactionService;

    public InteractionController(InteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    [Route("/setCompanion")]
    [HttpPut()]
    public ActionResult<bool> Put(int userId, int companionId)
    {
        bool setShowcase = this._interactionService.SetShowcaseCompanion(userId, companionId); 
        if(setShowcase == true)
        {
            return Ok("gj");
        }
        else
        {
            return Conflict("You cannot set your showcase companion to a companion that you do not own.");
        }
    }

    [Route("/Interactions/PetCompanion")]
    [HttpPut()]
    public ActionResult<Companion> PetCompanion(int userID, int companionID)
    {
        try
    	{
            Companion companionInstance = this._interactionService.PetCompanion(userID, companionID); 
            if(companionInstance != null)
            {
                return Ok(companionInstance);
            }
            else
            {
                return NotFound("Nah.");
            }
    	}          
    	catch(CompNotFound)
        {
            return NotFound("No companion with this ID exists."); 
        }	  
    	catch(UserNotFound)
        {
            return NotFound("No user with this ID exists."); 
        }	
    	catch(ResourceNotFound)
        {
            return NotFound("We couldn't find the specified information."); 
        }      
    }    

    [Route("/Interactions/FeedCompanion")]
    [HttpPut()]
    public ActionResult<Companion> FeedCompanion(int feederID, int companionID, int foodID)
    {
        try
    	{
            Companion companionInstance = this._interactionService.FeedCompanion(feederID, companionID, foodID); 
            if(companionInstance != null)
            {
                return Ok(companionInstance);
            }
            else
            {
                return NotFound("Nah.");
            }
        }
        catch(ResourceNotFound)
        {
            return NotFound();
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }    
    } 

    [Route("/Interactions/IncrementalDecrement")]
    [HttpPut()]
    public ActionResult<Companion> DecrementCompanionMoodValue(int companionID)
    {
        try
    	{
            Companion companionInstance = this._interactionService.DecrementCompanionMoodValue(companionID); 
            if(companionInstance != null)
            {
                return Ok(companionInstance);
            }
            else
            {
                return NotFound("Nah.");
            }
    	}
        catch(TooSoon)
        {
            return BadRequest("It has been less than five minutes since the last time the mood was changed.");
        }
    	catch(CompNotFound)
        {
            return NotFound("No companion with this ID exists."); 
        }
    	catch(UserNotFound)
        {
            return NotFound("No user with this ID exists."); 
        }	        
    	catch(ResourceNotFound)
        {
            return NotFound("There was nothing to decrement."); 
        }     
    }  

    [Route("/Interactions/DecrementCompanionHungerValue")]
    [HttpPut()]
    public ActionResult<Companion> DecrementCompanionHungerValue(int companionID)
    {
        try
    	{
            Companion companionInstance = this._interactionService.DecrementCompanionHungerValue(companionID); 
            if(companionInstance != null)
            {
                return Ok(companionInstance);
            }
            else
            {
                return NotFound("Nah.");
            }
        }
        catch(ResourceNotFound)
        {
            return NotFound();
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }           
}
