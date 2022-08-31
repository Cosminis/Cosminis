using DataAccess.Entities;
using CustomExceptions;
using Models;
using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;
 
public class CompanionRepo : ICompanionDAO
{
    private readonly wearelosingsteamContext _context;

    public CompanionRepo(wearelosingsteamContext context)
    {
        _context = context;
    }
  
    public Companion GenerateCompanion(int userIdInput)         //This method hatches a companion of a random species w/ a random emotion.
    {
        Random randomCreature = new Random();
        //int creatureRoulette = randomCreature.Next(3,9);            //random species generator (species are 3-9 because of an error...).
        int creatureRoulette = 0;           
        int creatureRarityRoulette = randomCreature.Next(0,100);

        // this assigns rarity to the new creatures that are hatched
        //creature index is only 3-8
        switch (creatureRarityRoulette)
        {
            case (creatureRarityRoulette < 51):
                Random common =  new Random();
                creatureRoulette = common.Next(3,5);
                break;
            case (creatureRarityRoulette < 75):
                Random uncommon =  new Random();
                creatureRoulette = uncommon.Next(5,7);
                break;
            case (creatureRarityRoulette < 99):                       //this is rare
                creatureRoulette = 7;
                break;
            default:
                creatureRoulette = 8;                           //this is super rare
                break;
        }


        Random randomEmotion = new Random();
        int emotionRoulette = randomCreature.Next(0,10);            //random emotion generator (0 worst, 10 is best).

        User userInstance = _context.Users.Find(userIdInput);       //grabbing user and checking null.
        if(userInstance == null)
        {
            throw new UserNotFound();
        }
            
        Companion newCompanion = new Companion()                    //New companion to be generated... standardized Mood/Hunger lvls for now.
        {
            UserFk = userIdInput,
            SpeciesFk = creatureRoulette,
            Emotion = emotionRoulette,
            Hunger = 100,
            Mood = 75,
            TimeSinceLastChangedMood = DateTime.Now,                //These two control the hunger/mood refreshes.
            TimeSinceLastChangedHunger = DateTime.Now,
            TimeSinceLastPet = DateTime.Now,                        //These two are timers so you can't pet and feed the comp. all the time.
            TimeSinceLastFed = DateTime.Now,
            CompanionBirthday = DateTime.Now        
        };

        userInstance.EggCount = userInstance.EggCount - 1;          //Taking an egg from the user (it hatched from this...).
        if(userInstance.EggCount < 0)
        {
            userInstance.EggCount = 0;                              //If they have 0 eggs the timer won't reset until they get another
            throw new TooFewResources();
        }
        if(userInstance.EggCount >= 1)                              //If more than 1 egg, resets so that in x time the next egg will hatch
        {
            userInstance.EggTimer = DateTime.Now;
        }

        _context.Companions.Add(newCompanion);                      //adding and saving changes

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
}