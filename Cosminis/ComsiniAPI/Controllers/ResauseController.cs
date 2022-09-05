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


    [Route("/AddGems")]
    [HttpPut]
    public ActionResult<User> UpdateGems(int userId, int Amount)
    {
        try 
        {
            User user2Add2 = _resourceServices.UpdateGems(userId, Amount);
            return Ok(user2Add2); 
        }
        catch(UserNotFound)
        {
            return NotFound("This user doesn't exist!"); 
        }
    }    

    [Route("/Resources/Purchase/Gems")]
    [HttpPut()]
    public ActionResult<List<FoodInventory>> PurchaseWithGems(int userId, int[] foodQtyArr, int eggQty, int Gold)
    {
    	try
    	{
    		List<FoodInventory> groceryList = _resourceServices.PurchaseWithGems(userId, foodQtyArr, eggQty, Gold);
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

    [Route("/Resources/PurchaseGems")]
    [HttpPut]
    public ActionResult<Order> PurchaseGems(int userId, int Amount, decimal cost)
    {
        try 
        {
            Order receiptToBeGenerated = _resourceServices.PurchaseGems(userId, Amount, cost);
            return Ok(receiptToBeGenerated); 
        }
        catch(UserNotFound)
        {
            return NotFound("This user doesn't exist!"); 
        }
    }

    [Route("/Resources/GetReceiptByUserId")]
    [HttpGet]
    public ActionResult<Order> GetReceiptsByUserId(int userId)
    {
        try 
        {
            List<Order> receipts = _resourceServices.GetReceiptsByUserId(userId);
            return Ok(receipts); 
        }
        catch(OrderNotFound)
        {
            return NotFound("This user has no orders!"); 
        }        
        catch(UserNotFound)
        {
            return NotFound("This user doesn't exist!"); 
        }

    }   
    [Route("/Resources/AddGold")]
    [HttpPut()]      
    public ActionResult<bool> AddGold(int UserId, int Amount)
    {
        try
        {
             bool returnValue = _resourceServices.AddGold(UserId, Amount);
             return Ok(returnValue);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}