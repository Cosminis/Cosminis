using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataAccess;

public class InteractionRepo : Interactions
{
    private readonly wearelosingsteamContext _context;
    private readonly IUserDAO _userRepo;
    private readonly ICompanionDAO _compRepo;
    private readonly IResourceGen _ResourceRepo;
    
    public InteractionRepo(wearelosingsteamContext context, IUserDAO userRepo, ICompanionDAO compRepo, IResourceGen ResourceRepo)
    {
        _context = context;
        _userRepo = userRepo;
        _compRepo = compRepo;
        _ResourceRepo = ResourceRepo;
    }    

    /// <summary>
    /// Method that modify the mood value of a particular companion
    /// </summary>
    /// <param name="companionID"></param>
    /// <param name="amount"></param>
    public Companion SetCompanionMoodValue(int companionID, int amount)
    {
        Companion companionToDepress = _context.Companions.Find(companionID);  //Get comp followed by checkifnull
        if(companionToDepress == null)
        {
            throw new CompNotFound();
        }

        companionToDepress.Mood = companionToDepress.Mood + amount; //adjust mood based on determined amount

        if(companionToDepress.Mood <= 0)
        {
            companionToDepress.Mood = 0; //preventing negative numbers
        }

        if(companionToDepress.Mood >= 100)
        {
            companionToDepress.Mood = 100; //preventing negative numbers
        }

        companionToDepress.TimeSinceLastChangedMood = DateTime.Now;              //resetting the mood timer on the companion

        _context.SaveChanges();

        _context.ChangeTracker.Clear();

        return companionToDepress;
    }

    public EmotionChart GetEmotionByEmotionId(int emotionId)
    {
        return _context.EmotionCharts.FirstOrDefault(emotionToBeFound => emotionToBeFound.EmotionId == emotionId) ?? throw new ResourceNotFound("No emotion with this ID exists.");
    }

    /// <summary>
    /// Method that modify the hunger value of a particular companion
    /// </summary>
    /// <param name="companionID"></param>
    /// <param name="amount"></param>
    public Companion SetCompanionHungerValue(int companionID, int amount)
    {
        Companion companionToStarve = _context.Companions.Find(companionID);  //Retrieve companion object from database by the given CompanionID
        if(companionToStarve == null)
        {
            throw new ResourceNotFound();
        }
        companionToStarve.Hunger = companionToStarve.Hunger + amount;//Modify the hunger value
        if(companionToStarve.Hunger<0) //fix the minimum hunger value
        {
            companionToStarve.Hunger = 0;
        }
        companionToStarve.TimeSinceLastChangedHunger = DateTime.Now;
        _context.SaveChanges();//save changes
        _context.ChangeTracker.Clear();
        return companionToStarve;
    }

    /// <summary>
    /// Rolls from a pool of possible moods and assigns it to a companion
    /// </summary>
    /// <param name="companionID"></param>
    /// <param name="amount"></param>
    public bool RollCompanionEmotion(int companionID, int emotionId)
    {
        Companion companionEmotionToSet = _context.Companions.Find(companionID); //Grabbing the companion
        if(companionEmotionToSet == null)                                                   //Checking null
        {
            throw new CompNotFound();
        }

        IEnumerable<EmotionChart> emotionToSet =                   
            from EmotionCharts in _context.EmotionCharts                 //(Logic the same in below cases)
            where EmotionCharts.Quality == emotionId
            select EmotionCharts;      

        companionEmotionToSet.Emotion = emotionToSet.FirstOrDefault().EmotionId; //You can get less than 0 and greater than 10 but I figure we will figure this out together

        _context.SaveChanges();

        _context.ChangeTracker.Clear();

        return true;
    }

    /// <summary>
    /// Allow a user to feed a particular type of food to a particular companion
    /// </summary>
    /// <param name="feederID"></param>
    /// <param name="companionID"></param>
    /// <param name="foodID"></param>
    /// <returns></returns>
    public Companion FeedCompanion(int feederID, int companionID, int foodID)
    {
        Companion companionToStarve = _context.Companions.Find(companionID);  //Retrieve companion object from database by the given CompanionID

        DateTime notNullableDate = companionToStarve.TimeSinceLastFed ?? DateTime.Now;
        double totalMinutes = DateTime.Now.Subtract(notNullableDate).TotalMinutes; 

        companionToStarve.TimeSinceLastFed = DateTime.Now;

        if(companionToStarve.TimeSinceLastFed == null)
        {
            companionToStarve.TimeSinceLastFed = DateTime.Now;
            
            _context.SaveChanges();

            _context.ChangeTracker.Clear();

            throw new TooSoon();
        }

        companionToStarve.TimeSinceLastFed = DateTime.Now;

        if(totalMinutes < 5)
        {
            throw new TooSoon();
        }

        User user2Check = _context.Users.Find(feederID); //Retrieve user object from database by the given FeederID
        FoodStat food2Feed = _context.FoodStats.Find(foodID); //Retrieve foodStats object from database by the given CompanionID
        Species species2check = _context.Species.Find(companionToStarve.SpeciesFk); //Retrieve Species object from database by the given CompanionID
        Random RNGjesusManifested = new Random();  
        if(companionToStarve == null || user2Check == null || food2Feed == null || species2check==null)
        {
            throw new ResourceNotFound();
        }

        if(companionToStarve.Hunger>90)
        {
            throw new TooSoon("Your buddy ain't hungy yet!");
        }

        companionToStarve.TimeSinceLastFed = DateTime.Now;

        bool love = (species2check.FoodElementIdFk == food2Feed.FoodStatsId);
        bool hate = (species2check.OpposingEle == food2Feed.FoodStatsId);
        int baseAmountHunger = 0; //neither of these numbers make any damm sense
        int baseAmountMood = 0; 
        if(love)
        {
            baseAmountHunger = RNGjesusManifested.Next(25,31);
            baseAmountMood = RNGjesusManifested.Next(25,31);
        }
        else if(hate)
        {
            baseAmountHunger = RNGjesusManifested.Next(-25,11);
            baseAmountMood = RNGjesusManifested.Next(-25,11);
        }
        else
        {
            baseAmountHunger = RNGjesusManifested.Next(-15,31);
            baseAmountMood = RNGjesusManifested.Next(-15,31);
        }

        companionToStarve.TimeSinceLastFed = DateTime.Now;
        Console.WriteLine(companionToStarve.TimeSinceLastFed + "5");

        double HungerModifier = 1;
        double MoodModifier = 1;
        if(love || hate) //I know all of these can be compress into the if else block above, I am keeping them seperated for my own sanity sake, STFU
        {
            HungerModifier = HungerModifier + RNGjesusManifested.NextDouble();
            MoodModifier = MoodModifier + RNGjesusManifested.NextDouble();
            if(HungerModifier>1.90) //great success
            {
                HungerModifier = HungerModifier + (RNGjesusManifested.NextDouble()*0.2);
            }
            if(MoodModifier>1.90) //great success
            {
                MoodModifier = MoodModifier + (RNGjesusManifested.NextDouble()*0.2);
            }
            if(MoodModifier>1.95 && HungerModifier>1.95) //critical success! It also makes your companion invincible for two days when we get to the dungeon crawling feature
            {
                HungerModifier = HungerModifier + (RNGjesusManifested.NextDouble()*0.1);
                MoodModifier = MoodModifier + (RNGjesusManifested.NextDouble()*0.1);
            }
        }
        else
        {
            HungerModifier = HungerModifier - RNGjesusManifested.NextDouble();
            MoodModifier = MoodModifier - RNGjesusManifested.NextDouble();
            if(HungerModifier<0.15) //great failure
            {
                HungerModifier = HungerModifier - (RNGjesusManifested.NextDouble()*0.2);
            }
            if(MoodModifier<0.15) //great failure
            {
                MoodModifier = MoodModifier - (RNGjesusManifested.NextDouble()*0.2);
            }
            if(MoodModifier<0.05 && HungerModifier<0.05) //critical failure! It also makes your companion deal 50% less damage for the next two days
            {
                HungerModifier = HungerModifier - (RNGjesusManifested.NextDouble()*0.1);
                MoodModifier = MoodModifier - (RNGjesusManifested.NextDouble()*0.1);
            }
        }

        companionToStarve.TimeSinceLastFed = DateTime.Now;

        int moodAmount = 0;
        int hungerAmount = 0;
        if(love) //I know all of these can be compress into the if else block above, I am keeping them seperated for my own sanity sake, STFU
        {
            moodAmount = (int)Math.Ceiling(baseAmountMood*MoodModifier);
            hungerAmount = (int)Math.Ceiling(baseAmountHunger*HungerModifier);
        }
        else
        {
            moodAmount = (int)Math.Floor(baseAmountMood*MoodModifier);
            hungerAmount = (int)Math.Floor(baseAmountHunger*HungerModifier);
        }

        try
        {
            SetCompanionHungerValue(companionID,hungerAmount);
            SetCompanionMoodValue(companionID,moodAmount);

            _ResourceRepo.RemoveFood(feederID,foodID); //last step
            
            companionToStarve.TimeSinceLastFed = DateTime.Now;

            _context.SaveChanges();

            _context.ChangeTracker.Clear();            

            return companionToStarve; //operation success
        }
        catch(Exception)
        {
            throw;
        }
    }

    /// <summary>
    /// Allows a user to pet a companion, changing the said companion's mood base on their hunger level
    /// These numbers may change in the end, but that is less important than having the logic down of course.
    /// </summary>
    /// <param name="petterID"></param>
    /// <param name="companionID"></param>
    /// <returns></returns>
    public Companion PetCompanion(int userID, int companionID)//limit petting to every 3-5min
    {
        Random agitationRoll = new Random();             //For our random roll later

        Companion companionToPet = _compRepo.GetCompanionByCompanionId(companionID); //grabbing the companion
        if(companionToPet == null)                                                   //checking null
        {
            throw new CompNotFound();
        }

        if(companionToPet.TimeSinceLastPet == null)
        {    
            companionToPet.TimeSinceLastPet = DateTime.Now;
           
            _context.SaveChanges();

            _context.ChangeTracker.Clear();

            throw new TooSoon();
        }

        DateTime notNullableDate = companionToPet.TimeSinceLastPet ?? DateTime.Now;
        double totalMinutes = DateTime.Now.Subtract(notNullableDate).TotalMinutes; 

        if(totalMinutes < 5)
        {
            throw new TooSoon();
        }                

        User userToPet = _userRepo.GetUserByUserId(userID);  //grabbing the user
        if(userToPet == null)                                //checking null
        {
            throw new UserNotFound();
        }

        int moodToOffset = 0;

        int hungerMod = 0;       //this value will modify the chance for companion agitation based on hunger
        if(companionToPet.Hunger <= 15)
        {
            hungerMod = -20;        //"roll a agitation threshold based on hunger (if the pet is hungry, the agitation threshold should be weighted to roll high)"
        }
        else if(companionToPet.Hunger <= 30)
        {
            hungerMod = -10;
        }
        else if(companionToPet.Hunger <= 50)
        {
            hungerMod = -5;
        }        
        else if(companionToPet.Hunger <= 74)
        {
            hungerMod = -1;
        }
        else if(companionToPet.Hunger >= 75)
        {
            hungerMod = 10;
        }                  

        int moodMod = 0;       //this value will modify the chance for companion agitation based on mood
        if(companionToPet.Mood <= 15)
        {
            moodMod = -5;       
        }
        else if(companionToPet.Mood <= 30)
        {
            moodMod = 0;
        }
        else if(companionToPet.Mood <= 50)
        {
            moodMod = 5;
        }        
        else if(companionToPet.Mood <= 74)
        {
            moodMod = 15;
        }
        else if(companionToPet.Mood >= 75)
        {
            moodMod = 30;
        }        

        bool companionShowcase = false;            //Setting this to check if showcase companion
        int showcaseMod = 0;                       //If bool = true, check gets +10 to succeed on agitation threshold check
        if(userToPet.ShowcaseCompanionFk == companionToPet.CompanionId)//Checking whether it is or not
        {
            companionShowcase = true;     
        }

        if(companionShowcase == true)              //Setting Bonus if true
        {
            showcaseMod = 10;
        }

        int agitationBaseRoll = agitationRoll.Next(15, 25);//Rolling base roll with previously set random number generator

        int hostilityRoll = agitationBaseRoll + hungerMod + moodMod + showcaseMod;

        if(hostilityRoll < 30)
        {
            if(companionToPet.Mood <= 15)
            {
                moodToOffset = -7; //This is a weird one.... because the number is already soooo low it'll probably hit 0 or close to it anyway...      
            }
            else if(companionToPet.Mood <= 30)
            {
                moodToOffset = -15;     //This number is bigger than the above one because if it is agitated with a low mood we want the change obvious
            }
            else if(companionToPet.Mood <= 50)
            {
                moodToOffset = -10;     //Sucks to suck and it is noticable but not too bad 
            }        
            else if(companionToPet.Mood <= 74)
            {
                moodToOffset = 1;       //These numbers are pretty harsh but also I weighed it very likely for petting to be a positive result.
            }
            else if(companionToPet.Mood >= 75)
            {
                moodToOffset = 5;       //I mean does it really need to be much happier?
            }  
        }
        else if(hostilityRoll >= 31)
        {
            if(companionToPet.Mood <= 15)
            {
                moodToOffset = 30; //Give them a big bonus because it could be risky and they need it the most (we could make this a random range too if we want in theory)      
            }
            else if(companionToPet.Mood <= 30)
            {
                moodToOffset = 20;     //This number is bigger than the above one because if it is agitated with a low mood we want the change obvious
            }
            else if(companionToPet.Mood <= 50)
            {
                moodToOffset = 15;     //Numbers becoming less since the companion is already in a relatively good mood. Obvi we can change them.
            }        
            else if(companionToPet.Mood <= 74)
            {
                moodToOffset = 10;       
            }
            else if(companionToPet.Mood >= 75)
            {
                moodToOffset = 5;       //I mean does it really need to be much happier?
            } 
        }

        
        Console.WriteLine(showcaseMod);
        Console.WriteLine(moodMod);
        Console.WriteLine(hungerMod);
        Console.WriteLine(agitationBaseRoll);
        Console.WriteLine(hostilityRoll);
        Console.WriteLine(moodToOffset);
        
        
        companionToPet.Mood = companionToPet.Mood + moodToOffset; //I think rolling for agitation is good, but the actual numbers may wanna be changed in the end.

        if(companionToPet.Mood < 0) //preventing negatives and values over 100
        {
            companionToPet.Mood = 0;
        }
        if(companionToPet.Mood >= 100)
        {
            companionToPet.Mood = 100;
        }
        
        //Console.WriteLine(companionToPet.TimeSinceLastPet);

        companionToPet.TimeSinceLastPet = DateTime.Now;   

        //Console.WriteLine(companionToPet.TimeSinceLastPet);         

        _context.SaveChanges(); //Maybe this method could also have a percentage change to reroll the emotion? A greater chance to change emotion if mood is low or emotion quality is poor

        _context.ChangeTracker.Clear();

        return companionToPet;
    }

    /*/// <summary>
    /// Changing the showcased companion field of a perticular user
    /// </summary>
    /// <param name="userID"></param>
    /// <param name="companionID"></param>
    /// <returns></returns>*/
    public bool SetShowcaseCompanion(int userId, int companionId)
    {
        Companion companionInfo = _context.Companions.Find(companionId);
        if (companionInfo == null) //such companion does not exist
        {
            throw new CompNotFound();
        }
        User userInfo = _context.Users.Find(userId);
        if (userInfo == null) //such user does not exist
        {
            throw new UserNotFound();
        }
        if (companionInfo.UserFk == userInfo.UserId)
        {
            userInfo.ShowcaseCompanionFk = companionInfo.CompanionId; 
            _context.SaveChanges(); //persist the change
            _context.ChangeTracker.Clear(); //clear the tracker for the next setting of a showcase companion
            return true;
        }
        else
        {
            return false;
        }
    }

    public string PullConvo(int CompanionID)
    {
        Companion companionToTalk = _context.Companions.Find(CompanionID);  //Retrieve companion object from database by the given CompanionID
        if(companionToTalk==null)
        {
            throw new ResourceNotFound();
        }
        Random RNGjesusManifested = new Random();  
        int offsetQual = 0; //[-3,3]
        int baseQual = RNGjesusManifested.Next(3,8); //The PDF of this method aint gonna be continuous, but I am just too stupid to figure a decent way to implement a continuous distribution
        if(companionToTalk.Mood<15) // 14*7=98
        {
            offsetQual = -3;
        }
        else if(companionToTalk.Mood<29)
        {
            offsetQual = -2;
        }
        else if(companionToTalk.Mood<43)
        {
            offsetQual = -1;
        }
        else if(companionToTalk.Mood<47)
        {
            offsetQual = 0;
        }
        else if(companionToTalk.Mood<71)
        {
            offsetQual = 1;
        }
        else if(companionToTalk.Mood<85)
        {
            offsetQual = 2;
        }
        else
        {
            offsetQual = 3;
        }
        int endQual = baseQual + offsetQual; //[0,10]

        IEnumerable<Conversation> checkForSpecies = //copped this code whole sale from FriendsRepo
            (from Conversation in _context.Conversations
            where (Conversation.SpeciesFk == companionToTalk.SpeciesFk) && (Conversation.Quality == endQual)
            select Conversation);
        Conversation endConvo = checkForSpecies.FirstOrDefault(); //Retrieve A list of conversation that matches the given species.
        if(endConvo == null)
        {
            return "I want sometime for my self now, why don't you go touch some grass?";
        }
        else
        {
            return endConvo.Message;
        }
    }
}