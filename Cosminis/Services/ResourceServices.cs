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

    public User AddGems(int userId, int Amount)
    {
        User user2Add2 = _resourceRepo.AddGems(userId, Amount);
        return user2Add2; 
    } 
}