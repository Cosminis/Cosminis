using DataAccess.Entities;
using CustomExceptions;
using Models;
using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
namespace DataAccess;
 
public class CompanionRepo : ICompanionDAO
{
    private readonly wearelosingsteamContext _context;

    public CompanionRepo(wearelosingsteamContext context)
    {
        _context = context;
    }
      /// <summary>
      /// Generates random creature for user ranging from creature ID 3-8 due to legacy code
      /// </summary>
      /// <param name="userIdInput">Valid User ID</param>
      /// <returns></returns>
      /// <exception cref="UserNotFound">User doesn't exist</exception>
      /// <exception cref="TooFewResources">No Eggs</exception>
    public Companion GenerateCompanion(int userIdInput)          
    {
        Random randomCreature = new();           
        int creatureRarityRoulette = randomCreature.Next(0,100), creatureRoulette;

        // this assigns rarity to the new creatures that are hatched
        //creature index is only 3-8
        switch (creatureRarityRoulette)
        {
            case int n when (n < 51):
                Random common =  new();
                creatureRoulette = common.Next(3,5);
                break;
            case int n when (n < 75):
                Random uncommon =  new();
                creatureRoulette = uncommon.Next(5,7);
                break;
            case int n when (n < 99):                       //this is rare
                creatureRoulette = 7;
                break;
            default:
                creatureRoulette = 8;                           //this is super rare
                break;
        }         
        int emotionRoulette = randomCreature.Next(1,12); 
        User? userInstance = _context.Users.Find(userIdInput); 
        if(userInstance == null)
        {
            throw new UserNotFound();
        }            
        Companion newCompanion = new() 
        {
            UserFk = userIdInput,
            SpeciesFk = creatureRoulette,
            Emotion = emotionRoulette,
            Hunger = 100,
            Mood = 75,
            TimeSinceLastChangedMood = DateTime.Now,                
            TimeSinceLastChangedHunger = DateTime.Now,
            TimeSinceLastPet = DateTime.Now,                         
            TimeSinceLastFed = DateTime.Now,
            CompanionBirthday = DateTime.Now        
        };
        if(userInstance.EggCount < 0)
        {
            userInstance.EggCount = 0;                              
            throw new TooFewResources();
        }
        else if(userInstance.EggCount >= 1) 
        {
            userInstance.EggTimer = DateTime.Now;
        }
        userInstance.EggCount--;           
        _context.Companions.Add(newCompanion); 
        _context.SaveChanges();
        _context.ChangeTracker.Clear(); 
        return newCompanion;                                                        
    }
    
    public int SetCompanionMood()                                   //This is a relic from ancient times, to be ignored.
    {
        Random randomMood = new Random();
        int companionMood = randomMood.Next(1,4);

        return companionMood;
    }

    public Companion SetCompanionNickname(int companionId, string? nickname)    //Say you wanna nickname your companion....
    {
        Companion selectCompanion = GetCompanionByCompanionId(companionId);     //This will let you do that.
        if(selectCompanion == null)
        {
            throw new CompNotFound();
        }

        selectCompanion.Nickname = nickname;                                    //We "looked for a companion" (by ID) and set the name.

        _context.SaveChanges();
                                                                                //We saved the changes so now our friend has a name. Cute!
        _context.ChangeTracker.Clear();

        return selectCompanion;                                                 //Return said named friend.
    }

    public List<Companion> GetAllCompanions()
    {
        return _context.Companions.ToList();                                  
    }
   
    public List<Companion> GetCompanionByUser(int userId)                       //Finding allllll the companions someone is friends with
    {
        try
        { 
            List<Companion> companionList = new List<Companion>();              

            IEnumerable<Companion> companionQuery =                             //Query to search companions by userId.
                from Companions in _context.Companions
                where Companions.UserFk == userId
                select Companions;
        
            foreach(Companion companionReturn in companionQuery)                //Going through each object and adding it to a list.
            {
                companionList.Add(companionReturn);
            }        

            if(companionList.Count() < 1)                                       //Doesn't return if they have no friends (this shouldn't happen).
            {
                throw new UserNotFound();
            }

            return companionList;
        }
        catch(UserNotFound)                                                     //This is likely an unreachable catch statement
        {
            throw;
        }
    }

    public Companion GetCompanionByCompanionId(int companionId)                 //Please tell me you don't need comments for this.
    {
            return _context.Companions.FirstOrDefault(companionToBeFound => companionToBeFound.CompanionId == companionId) ?? throw new ResourceNotFound("No companion with this ID exists.");
    }

    public bool DeleteCompanion(int companionId)                                //Take a guess as to what this does...
    {
        Companion companionToEnd = _context.Companions.Find(companionId);  //Get comp followed by checkifnull
        if(companionToEnd == null)
        {
            throw new CompNotFound();
        }

        User userShowcaseCheck = _context.Users.Find(companionToEnd.UserFk);
        if (userShowcaseCheck.ShowcaseCompanionFk == companionToEnd.CompanionId)
        {
            throw new ShowWontGoYo();
        }

        _context.Companions.Remove(companionToEnd);                        //Killing the companion if it starves or we are feeling particularly merciless

        _context.SaveChanges();

        _context.ChangeTracker.Clear();

        return true;
    }

    public Species FindSpeciesByID(int SpeciesID)
    {
        return _context.Species.Find(SpeciesID) ?? throw new ResourceNotFound();
    }
}