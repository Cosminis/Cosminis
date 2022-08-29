using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class UserServices
{
	private readonly IUserDAO _userRepo;

    public UserServices(IUserDAO userRepo)
    {
        _userRepo = userRepo;
    }

    public User SearchFriend(string username)
    {
    	try
    	{
    		return _userRepo.GetUserByUserName(username);
    	}
    	catch(Exception)
        {
            throw;
        }	
    }

    public User SearchUserById(int userId)
    {
    	try
    	{
    		return _userRepo.GetUserByUserId(userId);
    	}
    	catch(Exception)
        {
            throw;
        }	
    }
    public List<User> GetAll()
    {
        return _userRepo.GetAll();
    }
    public User LoginOrReggi(User user2Check)
    {
        try //checks if a user with the username already exist
        {
            User user = _userRepo.GetUserByUserName(user2Check.Username);
            return user; //if yes: return the relevant user object
        }
        catch(UserNotFound) //if not: create a user with the email as the username
        {
            User newUser = new User()
            {
                Username = user2Check.Username,
                Password = user2Check.Password,
                AccountAge = DateTime.Now,
                GoldCount = 0,
                EggCount = 0,
                EggTimer = DateTime.Now,
                AboutMe = user2Check.AboutMe,
            };
            try
            {
                return _userRepo.CreateUser(newUser);
            }
            catch(Exception)
            {
                throw;
            }
        }
    }
}