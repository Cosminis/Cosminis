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
public class ResourceController : ControllerBase
{
	private readonly ResourceServices _resourceServices;

    public ResourceController(ResourceServices resourceServices)
    {
        _resourceServices = resourceServices;
    }

    [Route("/Resources/Purchase")]
    [HttpPut()]
    public ActionResult<List<FoodInventory>> Purchase(int userId, int[] foodQtyArr, int eggQty)
    {
    	try
    	{
    		List<FoodInventory> groceryList = _resourceServices.Purchase(userId, foodQtyArr, eggQty);
    		return Ok(groceryList); 
    	}
        catch(ResourceNotFound)
        {
            return NotFound("Something went wrong."); 
        }	
        catch(InsufficientFunds)
        {
            return NotFound("You need more money!"); 
        }	
        catch(GottaBuySomething)
        {
            return NotFound("You gotta buy something, kid!"); 
        }	        
    }  

    [Route("/foodsUnder")]
    [HttpGet()]
    public ActionResult<List<FoodInventory>> GetFoodInventoryByUserId(int userId)
    {
        try 
        {
            List<FoodInventory> food = _resourceServices.GetFoodInventoryByUserId(userId);
            return Ok(food); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("That user has no food"); 
        }
    }
}