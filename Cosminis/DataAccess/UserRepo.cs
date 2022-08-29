using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataAccess;
 
public class UserRepo : IUserDAO
{
    private readonly wearelosingsteamContext _context;

    public UserRepo(wearelosingsteamContext context)
    {
        _context = context;
    }
    
    public User CreateUser(User user)
    {
        _context.Users.Add(user); //Add a new user into the table

        _context.SaveChanges(); //persist the change

        _context.ChangeTracker.Clear(); //clear the tracker for the next person

        return user; //return the inputed user info
    }
  
    //FirstOrDefault helps to bypass the issues that arise from deferred execution because now the query is being enumerated
    public User GetUserByUserName(string username) //selects and returns all of the user information where table username = input username
    {                                              
        return _context.Users.FirstOrDefault(user => user.Username == username) ?? throw new UserNotFound("No user with that username was found.");     
    }

    public User GetUserByUserId(int userId) //selects and returns all of the user information where table userId = input userId
    {                                              
        return _context.Users.FirstOrDefault(user => user.UserId == userId) ?? throw new UserNotFound("No user with that userId was found.");     
    }
    public List<User> GetAll()
    {
        return _context.Users.ToList();
    }
}