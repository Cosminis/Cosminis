using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

public class InteractionController
{
	private readonly InteractionService _interactionService;

    public InteractionController(InteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    public IResult DecrementCompanionMoodValue(int companionID)
    {
    	try
    	{
    		Companion companionInstance = _interactionService.DecrementCompanionMoodValue(companionID);
    		return Results.Accepted("/Interactions/IncrementalDecrement", companionInstance); 
    	}
        catch(TooSoon)
        {
            return Results.BadRequest("It has been less than five minutes since the last time the mood was changed.");
        }
    	catch(CompNotFound)
        {
            return Results.NotFound("No companion with this ID exists."); 
        }
    	catch(UserNotFound)
        {
            return Results.NotFound("No user with this ID exists."); 
        }	        
    	catch(ResourceNotFound)
        {
            return Results.NotFound("There was nothing to decrement."); 
        }	
    }

    public IResult ReRollCompanionEmotion(int companionID)
    {
    	try
    	{
    		_interactionService.ReRollCompanionEmotion(companionID);
    		return Results.Accepted("/Interactions/RerollEmotion"); 
    	}
    	catch(CompNotFound)
        {
            return Results.NotFound("No companion with this ID exists."); 
        }        
    	catch(ResourceNotFound)
        {
            return Results.NotFound("No companion with this ID exists."); 
        }	
    }    

    public IResult PetCompanion(int userID, int companionID)
    {
    	try
    	{
    		Companion companionInstance = _interactionService.PetCompanion(userID, companionID);
    		return Results.Accepted("/Interactions/PetCompanion", companionInstance); 
    	}
        catch(TooSoon)
        {
            return Results.BadRequest("It has been less than five minutes since this companion has been pet.");
        }                  
    	catch(CompNotFound)
        {
            return Results.NotFound("No companion with this ID exists."); 
        }	  
    	catch(UserNotFound)
        {
            return Results.NotFound("No user with this ID exists."); 
        }	
    	catch(ResourceNotFound)
        {
            return Results.NotFound("We couldn't find the specified information."); 
        }	
    }

    public IResult DecrementCompanionHungerValue(int companionID)
    {
        try
        {
            Companion companionInstance = _interactionService.DecrementCompanionHungerValue(companionID);
            return Results.Accepted("/Interactions/DecrementCompanionHungerValue", companionInstance);
        }
        catch(ResourceNotFound)
        {
            return Results.NotFound();
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
    }

    public IResult FeedCompanion(int feederID, int companionID, int foodID)
    {
        try
        {
            Companion companionInstance = _interactionService.FeedCompanion(feederID, companionID, foodID);
            return Results.Accepted("/Interactions/FeedCompanion", companionInstance); 
        }
        catch(TooSoon)
        {
            return Results.BadRequest("It has been less than five minutes since this companion has been fed.");
        } 
        catch(ResourceNotFound)
        {
            return Results.NotFound();
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        } 
    }

    public IResult SetShowcaseCompanion(int userId, int companionId)
    {
        try
        {
            if(_interactionService.SetShowcaseCompanion(userId, companionId))
            {
                return Results.Ok(true); 
            }
            else
            {
                return Results.Conflict("You cannot set your showcase companion to a companion that you do not own.");
            }
        }
        catch(CompNotFound)
        {
            return Results.NotFound("Such a companion does not exist"); 
        }
        catch(UserNotFound)
        {
            return Results.NotFound("Such a user does not exist"); 
        }    
    }

    public IResult PullConvo(int companionID)
    {
        try
        {
            return Results.Ok(_interactionService.PullConvo(companionID));
        }
        catch(ResourceNotFound)
        {
            return Results.NotFound();
        }
        catch(Exception e)
        {
            return Results.BadRequest(e.Message);
        }
    }
}     
