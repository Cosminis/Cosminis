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
    private readonly ICompanionDAO _companionRepo;

    public UserServices(IUserDAO userRepo, ICompanionDAO companionRepo)
    {
        _userRepo = userRepo;
        _companionRepo = companionRepo;
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
                EggCount = 1,
                EggTimer = DateTime.Now,
                AboutMe = user2Check.AboutMe,
            };
            try  // check for create new user 
            {
                User foundUser = _userRepo.CreateUser(newUser);

                _companionRepo.GenerateCompanion(foundUser.UserId); // when new user craete successfully, it has to creat companion

                return foundUser; // if found, return new user

            }
            catch(Exception)
            {
                throw;
            }
        }
    }
}