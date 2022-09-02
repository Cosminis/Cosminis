using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class ResourceServices
{
    private readonly IResourceGen _resourceRepo;
	private readonly IUserDAO _userRepo;    

    public ResourceServices(IResourceGen resourceRepo, IUserDAO userRepo)
    {
        _resourceRepo = resourceRepo;
        _userRepo = userRepo;        
    }
    public bool AddGold(int UserId, int Amount)
    {
         User user = new User(){
            UserId = UserId
         };
         try{
              return _resourceRepo.AddGold(user, Amount);
         }
         catch{
              throw;
         }
    }
    public List<FoodInventory> GetFoodInventoryByUserId(int userId)
    {
        List<FoodInventory> food = _resourceRepo.GetFoodInventoryByUserId(userId);
        return food; 
    }

    public List<FoodInventory> Purchase(int userId, int[] foodQtyArr, int eggQty)
    {
        if(foodQtyArr.Sum() <= 0 && eggQty <= 0)
        {
            throw new GottaBuySomething();
        }        

        List<FoodInventory> groceryList = _resourceRepo.Purchase(userId, foodQtyArr, eggQty);
        return groceryList;
    }   

    public User UpdateGems(int userId, int Amount)
    {
        User user2Add2 = _resourceRepo.UpdateGems(userId, Amount);
        return user2Add2; 
    } 
    
    public List<FoodInventory> PurchaseWithGems(int userId, int[] foodQtyArr, int eggQty, int Gold)
    {
        if(foodQtyArr.Sum() <= 0 && eggQty <= 0 && Gold <= 0)
        {
            throw new GottaBuySomething();
        }        

        List<FoodInventory> groceryList = _resourceRepo.PurchaseWithGems(userId, foodQtyArr, eggQty, Gold);
        return groceryList;
    }

    public Order PurchaseGems(int userId, int Amount, decimal cost)
    {
        User user2Add2 = _resourceRepo.UpdateGems(userId, Amount);
        Order receiptToBeGenerated = _resourceRepo.createOrder(userId, cost);
        
        return receiptToBeGenerated;
    }

    public List<Order> GetReceiptsByUserId(int userId)
    {
        List<Order> receipts = _resourceRepo.GetReceiptsByUserId(userId);
        return receipts; 
    }
    public bool AddEgg(User User, int Amount)
    {
        try
        {
            return _resourceRepo.AddEgg(User, Amount);
        }
        catch (ResourceNotFound)
        {
            throw;
        }
    }
}