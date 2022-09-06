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
    [HttpPut]
    public ActionResult<bool> showcaseCompanion(int userId, int companionId)
    {
        try
        {
            if(_interactionService.SetShowcaseCompanion(userId, companionId))
            {
                return Ok(true);
            }
            return Conflict("You cannot set your showcase companion to a companion you do not own.");
        }
        catch(CompNotFound)
        {
            return NotFound("Such a companion does not exist"); 
        }
        catch(UserNotFound)
        {
            return NotFound("Such a user does not exist"); 
        }         
    }

    [Route("/Interactions/PetCompanion")]
    [HttpPut]
    public ActionResult<Companion> PetCompanion(int userID, int companionID)
    {
        try
    	{
            Companion companionInstance = _interactionService.PetCompanion(userID, companionID);
            return Ok(companionInstance);
    	}   
        catch(TooSoon)
        {
            return BadRequest("It has been less than five minutes since this companion has been pet.");
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
    [HttpPut]
    public ActionResult<Companion> FeedCompanion(int feederID, int companionID, int foodID)
    {
        try
    	{
            Companion companionInstance = _interactionService.FeedCompanion(feederID, companionID, foodID); 
            return Ok(companionInstance);
        }
        catch(TooSoon)
        {
            return BadRequest("It has been less than five minutes since this companion has been fed.");
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
    [HttpPut]
    public ActionResult<Companion> DecrementCompanionMoodValue(int companionID)
    {
        try
    	{
            Companion companionInstance = _interactionService.DecrementCompanionMoodValue(companionID); 
            return Ok(companionInstance);
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
    [HttpPut]
    public ActionResult<Companion> DecrementCompanionHungerValue(int companionID)
    {
        try
    	{
            Companion companionInstance = _interactionService.DecrementCompanionHungerValue(companionID); 
            return Ok(companionInstance);
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

    [Route("/Interactions/ReRollEmotion")]
    [HttpPut]
    public ActionResult<bool> ReRollCompanionEmotion(int companionID)
    {
        try
    	{
            _interactionService.ReRollCompanionEmotion(companionID); 
            return Ok(true);
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
