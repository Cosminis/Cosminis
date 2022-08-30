using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

public class ResourceController
{
	private readonly ResourceServices _resourceServices;

    public ResourceController(ResourceServices resourceServices)
    {
        _resourceServices = resourceServices;
    }

    public IResult GetFoodInventoryByUserId(int userId)
    {
        try 
        {
            List<FoodInventory> food = _resourceServices.GetFoodInventoryByUserId(userId);
            return Results.Ok(food); 
        }
        catch(ResourceNotFound)
        {
            return Results.NotFound("That user has no food"); 
        }
    }

    public IResult Purchase(int userId, int[] foodQtyArr, int eggQty)
    {
    	try
    	{
    		List<FoodInventory> groceryList = _resourceServices.Purchase(userId, foodQtyArr, eggQty);
    		return Results.Ok(groceryList); 
    	}
        catch(ResourceNotFound)
        {
            return Results.NotFound("Something went wrong."); 
        }	
        catch(InsufficientFunds)
        {
            return Results.NotFound("You need more money!"); 
        }	
        catch(GottaBuySomething)
        {
            return Results.NotFound("You gotta buy something, kid!"); 
        }	        
    }    

    public IResult UpdateGems(int userId, int Amount)
    {
    	try
    	{
    		User user2Add2 = _resourceServices.UpdateGems(userId, Amount);
    		return Results.Ok(user2Add2); 
    	}
      catch(UserNotFound)
      {
        return Results.NotFound("This user doesn't exist."); 
      }	        
    }

    public IResult PurchaseWithGems(int userId, int[] foodQtyArr, int eggQty, int Gold)
    {
    	try
    	{
    		List<FoodInventory> groceryList = _resourceServices.Purchase(userId, foodQtyArr, eggQty);
    		return Results.Ok(groceryList); 
    	}
        catch(ResourceNotFound)
        {
            return Results.NotFound("Something went wrong."); 
        }	
        catch(InsufficientFunds)
        {
            return Results.NotFound("You need more money!"); 
        }	
        catch(GottaBuySomething)
        {
            return Results.NotFound("You gotta buy something, kid!"); 
        }	        
    }      
}