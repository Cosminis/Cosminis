using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class InteractionService
{
    //Honey wake up, it is time for you to write your dependacy injection!
    private readonly ICompanionDAO _compRepo;
    private readonly Interactions _interRepo;
	private readonly IUserDAO _userRepo;
    private readonly IPostDAO _PostRepo;

    public InteractionService(ICompanionDAO compRepo, IUserDAO userRepo, Interactions interRepo, IPostDAO postRepo)
    {
        _interRepo = interRepo;
        _compRepo = compRepo;
        _userRepo = userRepo;
        _PostRepo = postRepo;
    }   

    public Companion DecrementCompanionMoodValue(int companionID)
    {
        Random moodDecrementer = new Random();                                 //creating random number

        int moodDecrementAmount = 0;                                           //This will be the amount that actually gets taken

        Companion companionMoodToShift = _compRepo.GetCompanionByCompanionId(companionID); //grabbing the companion to change the mood of
        if(companionMoodToShift == null)                                                   //checking null
        {
            throw new CompNotFound();
        }
        if(companionMoodToShift.TimeSinceLastChangedMood == null)
        {
            companionMoodToShift.TimeSinceLastChangedMood = DateTime.Now;

            _interRepo.SetCompanionMoodValue(companionID, 0);

            throw new TooSoon();
        }

        try
        {
            TimeSpan minuteDifference = (TimeSpan)(DateTime.Now - companionMoodToShift.TimeSinceLastChangedMood);//diff between now and 'last decrement'

            double totalMinutes = minuteDifference.TotalMinutes;  //converting minutes to a double

            if(totalMinutes <= 1)                  //if 0 we can end the function because in theory we already changed the mood?
            {
                throw new TooSoon();               //maybe not good? lol
            }

            int convertedTime = (int)(Math.Floor(totalMinutes));                //converting to int for easier use
            
            User companionUser = _userRepo.GetUserByUserId(companionMoodToShift.UserFk);
            bool companionShowcase = false;
            if(companionUser.ShowcaseCompanionFk == companionMoodToShift.CompanionId)//Checking whether it is or not
            {
                companionShowcase = true;              //If this is true, mood decreases at a lessened rate
            }
            
            int hungerMod = 0; //this value will modify the chance for a greater mood decrement based on hunger
            if(companionMoodToShift.Hunger <= 25)
            {
                hungerMod = 90;
            }
            else if(companionMoodToShift.Hunger <= 50)
            {
                hungerMod = 30;
            }
            else if(companionMoodToShift.Hunger <= 75)
            {
                hungerMod = 10;
            }

            int emotionIdentifier = companionMoodToShift.Emotion; //getting the emotion so that I can create a modifer based on emotion quality

            EmotionChart emotionToFind = _interRepo.GetEmotionByEmotionId(emotionIdentifier);

            int emotionMod = 0; //this value will modify the chance for a greater mood decrement based on emotion state
            if(emotionToFind.Quality <= 2)
            {
                emotionMod = 150;
            }
            else if(emotionToFind.Quality <= 4)
            {
                emotionMod = 90;
            }
            else if(emotionToFind.Quality <= 6)
            {
                emotionMod = 30;
            }
            else if(emotionToFind.Quality >= 7)
            {
                emotionMod = 0;
            }           
            
            int numInstances = convertedTime / 5; //calculating how many times to tick mood decrements
            if(numInstances >= 5)
            {
                numInstances = 5;
            }                                   
                                                 //as long as there are instances greater than 0 it will decrement mood based on
            Random randomNum = new Random();     // (a random value) + (mod based on hunger) + (mod based on current emotion quality)
                                                 //these values affect the CHANCE of a change being more or less dramatic
            int moodShift = randomNum.Next(90);  //defining whether a showcase companion is more or less affected is in DataAccess

            int amountDeterminer = moodShift + hungerMod + emotionMod;

            for(int x = numInstances; x > 0; x--)
            {                                     
                int moodAdjust = moodDecrementer.Next(1, amountDeterminer);            //"Weight" of moodDecrement determined by hungerlvl

                if(moodAdjust <= 10)                   //Completely original numbers (this is "chance")
                {
                    moodDecrementAmount = -3;           //Actually original numbers (this is "static amt")
                    if(companionShowcase == true)
                    {
                        moodDecrementAmount = -1;
                    }
                }
                else if(moodAdjust <= 30)
                {
                    moodDecrementAmount = -7;
                    if(companionShowcase == true)
                    {
                        moodDecrementAmount = -5;
                    }
                }
                else if(moodAdjust <= 90)
                {
                    moodDecrementAmount = -13;
                    if(companionShowcase == true)
                    {
                        moodDecrementAmount = -10;
                    }
                }
                else if(moodAdjust <= 270)
                {
                    moodDecrementAmount = -20;
                    if(companionShowcase == true)
                    {
                        moodDecrementAmount = -15;
                    }
                }                

                Console.WriteLine(moodDecrementAmount);

                _interRepo.SetCompanionMoodValue(companionID, moodDecrementAmount);

                
                ReRollCompanionEmotion(companionID); //idk if we want to do this EVERY time but it's kinda cool.

                Console.WriteLine(companionMoodToShift); 
                return companionMoodToShift;
            }
        }
        catch(Exception)
        {
            throw new TooSoon();
        }

        return companionMoodToShift;
    }
    
    public Companion DecrementCompanionHungerValue(int companionID)
    {
        Companion companionHungerToShift = _compRepo.GetCompanionByCompanionId(companionID); //grabbing the companion
        User companionUser = _userRepo.GetUserByUserId(companionHungerToShift.UserFk); //grabbing the owner of the companion
        bool isDisplay = (companionID == companionUser.ShowcaseCompanionFk); //check if the companion is on display
        int amount = 0;
        if(companionHungerToShift == null || companionUser==null)//checking null
        {
            throw new ResourceNotFound();
        }
        if(companionHungerToShift.Hunger == null)
        {
            companionHungerToShift.Mood = 0;
        }
        if(companionHungerToShift.TimeSinceLastChangedHunger == null)//if this is the first instance, set it to now
        {
            companionHungerToShift.TimeSinceLastChangedHunger = DateTime.Now;

            _interRepo.SetCompanionHungerValue(companionID, 0);

            throw new TooSoon();     
        }

        try
        {
            DateTime notNullableDate = companionHungerToShift.TimeSinceLastChangedHunger ?? DateTime.Now; //who thought this was a good idea?
            double totalMinutes = DateTime.Now.Subtract(notNullableDate).TotalMinutes;  //converting minutes to a double
            if(isDisplay)//determine the amount
            {
                amount = (int)Math.Round(totalMinutes * .75 * 1.3); //SOMEONE PLEASE NORMALIZED THE NUMBERS
            }
            else
            {
                amount = (int)Math.Round(totalMinutes * .75); 
            }

            amount = amount * -1;


            Random RNGjesusManifested = new Random(); 
            int offSet = RNGjesusManifested.Next(-10,11);
            double compHung = companionHungerToShift.Hunger ?? 75; //whoever set the mood and hunger to be nullable in the database needs to be condemned 
            double chanceRR = (100 * Math.Exp(-0.05*compHung)) + offSet; //Maths
            Console.WriteLine(100 * Math.Exp(-0.05*compHung));
            bool RR = (RNGjesusManifested.Next(010) < chanceRR); //see of the emotion gets re rolled
            if(RR)
            {
                try
                {
                    ReRollCompanionEmotion(companionID);
                }
                catch(Exception)
                {
                    throw;
                }
            }

            return _interRepo.SetCompanionHungerValue(companionID,amount);
            
        }
        catch(Exception e)
        {
            Console.WriteLine(e.Message);
            throw;
        }
        return companionHungerToShift;
    }

    public bool ReRollCompanionEmotion(int companionID)
    {
        Random randomEmotion = new Random();  

        Companion companionEmotionToSet = _compRepo.GetCompanionByCompanionId(companionID); //grabbing the companion who's emotion we want to change

        EmotionChart emotionToFind = _interRepo.GetEmotionByEmotionId(companionEmotionToSet.Emotion);

        int baseEmotionRand = randomEmotion.Next(10);// Add to current state to see if the companion will re roll emotion. Higher roll = less likely re roll.
        int rerollDeterminer = 0;                         //This will be the output of these logical operations and set the new emotion of the companion.
        int qualityMod = 0;                      //This is a modifier based on current companion Emotion quality (these affect the CHANCE of a re roll)
        int moodMod = 0;                         //This is a modifier based on current companion mood (these affect the CHANCE of a re roll)
        int hungerMod = 0;                         //This is a modifier based on current companion hunger (these affect the CHANCE of a re roll)
        bool reRoll = false;

        if(emotionToFind.Quality <= 2)
        {
            qualityMod = 0;
        }
        else if(emotionToFind.Quality <= 4)
        {
            qualityMod = 3;
        }
        else if(emotionToFind.Quality <= 6)
        {
            qualityMod = 9;
        }
        else if(emotionToFind.Quality >= 7)
        {
            qualityMod = 15;
        }   

        if(companionEmotionToSet.Mood <= 15)               //These tables increase the likelyhood of a mood reroll if the companion has a bad mood or bad quality emotion
        {
            moodMod = 0;
        }
        else if(companionEmotionToSet.Mood <= 35)
        {
            moodMod = 1;
        }
        else if(companionEmotionToSet.Mood <= 50)
        {
            moodMod = 3;
        }            
        else if(companionEmotionToSet.Mood <= 75)
        {
            moodMod = 9;
        }
        else if(companionEmotionToSet.Mood >= 85)
        {
            moodMod = 15;
        }  

        if(companionEmotionToSet.Hunger <= 15)               //These tables increase the likelyhood of a mood reroll if the companion has a bad mood or bad quality emotion
        {
            hungerMod = 0;
        }
        else if(companionEmotionToSet.Hunger <= 35)
        {
            hungerMod = 1;
        }
        else if(companionEmotionToSet.Hunger <= 50)
        {
            hungerMod = 3;
        }            
        else if(companionEmotionToSet.Hunger <= 75)
        {
            hungerMod = 9;
        }
        else if(companionEmotionToSet.Hunger >= 85)
        {
            hungerMod = 15;
        }  


        rerollDeterminer = baseEmotionRand + qualityMod + moodMod + hungerMod;

        if(rerollDeterminer <= 27)
        {
            reRoll = true;
        }

        Random secondPass = new Random(); //at this point we determine which emotion we will get with a modifier if there was a better mood/emotion quality before.

        int emotionAdjust = secondPass.Next(0, 11);            //"Weight" of moodDecrement determined by hungerlvl
        int secondaryMoodMod = 0;
        int secondaryQualityMod = 0;
        int secondaryHungerMod = 0;

        if(emotionToFind.Quality <= 1)
        {
            secondaryQualityMod = -2;
        }
        else if(emotionToFind.Quality <= 3)
        {
            secondaryQualityMod = 1;
        }        
        else if(emotionToFind.Quality <= 5)
        {
            secondaryQualityMod = 0;
        }
        else if(emotionToFind.Quality <= 7)
        {
            secondaryQualityMod = 1;
        } 
        else if(emotionToFind.Quality <= 10)
        {
            secondaryQualityMod = 2;
        }        


        if(companionEmotionToSet.Mood <= 20)
        {
            secondaryMoodMod = -2;
        }
        else if(companionEmotionToSet.Mood <= 40)
        {
            secondaryMoodMod = -1;
        }         
        else if(companionEmotionToSet.Mood <= 60)
        {
            secondaryMoodMod = 0;
        }  
        else if(companionEmotionToSet.Mood <= 80)
        {
            secondaryMoodMod = 2;
        }
        else if(companionEmotionToSet.Mood <= 100)
        {
            secondaryMoodMod = 2;
        }        

        if(companionEmotionToSet.Hunger <= 20)
        {
            secondaryHungerMod = -2;
        }
        else if(companionEmotionToSet.Hunger <= 40)
        {
            secondaryHungerMod = -1;
        }         
        else if(companionEmotionToSet.Hunger <= 60)
        {
            secondaryHungerMod = 0;
        }  
        else if(companionEmotionToSet.Hunger <= 80)
        {
            secondaryHungerMod = 2;
        }
        else if(companionEmotionToSet.Hunger <= 100)
        {
            secondaryHungerMod = 2;
        }                          

        int emotionId = emotionAdjust + secondaryQualityMod + secondaryMoodMod;

        if(emotionId < 0)
        {
            emotionId = 0;
        }

        if(emotionId > 11)
        {
            emotionId = 11;
        }

        try
        {
            _interRepo.RollCompanionEmotion(companionID, emotionId);
            if(companionID == null)
            {
                throw new ResourceNotFound();
            }
            return _interRepo.RollCompanionEmotion(companionID, emotionId);
        }
        catch (ResourceNotFound)
        {
            throw;
        }        
        
        return false;
    }

    public Companion FeedCompanion(int feederID, int companionID, int foodID)
    {
        Companion checkingComp = _compRepo.GetCompanionByCompanionId(companionID);
        if(checkingComp == null || checkingComp.Mood == null)
        {
            throw new ResourceNotFound();
        }

        Companion checkingComp2 = new Companion();
        try
        {
            checkingComp2 = _interRepo.FeedCompanion(feederID, companionID, foodID); //first thing first
        }
        catch(Exception)
        {
            throw;
        }

        Random RNGjesusManifested = new Random();  

        int offSet = RNGjesusManifested.Next(-10,11);
        double compMood = checkingComp.Mood ?? 75; //whoever set the mood and hunger to be nullable in the database needs to be condemned 
        double chanceRR = (100 * Math.Exp(-0.05*compMood)) + offSet; //Maths
        Console.WriteLine(100 * Math.Exp(-0.05*compMood));
        bool RR = (RNGjesusManifested.Next(010) < chanceRR); //see of the emotion gets re rolled
        if(RR)
        {
            try
            {
                ReRollCompanionEmotion(companionID);
            }
            catch(Exception)
            {
                throw;
            }
        }

        if(checkingComp.UserFk != feederID) //If friend or stranger, make post [Companions user_FK]; if it is your own, pat yourself on the back.
        {
            User feedingUser = _userRepo.GetUserByUserId(feederID);
            Post Post = new Post();

            if(checkingComp2.Hunger > checkingComp.Hunger)
            {            
                Post = new Post()//define post properties (This person came up and feed my companion!).
                {
                    UserIdFk = checkingComp.UserFk,
                    Content = feedingUser.Password + " fed my companion while I was away, thank you!"
                };
            }
            else
            {
                Post = new Post()//define post properties (This person came up and feed my companion!).
                {
                    UserIdFk = checkingComp2.UserFk,
                    Content = feedingUser.Password + " fed my companion some awful food, and now it's so hostile!... Thanks for nothing!"
                };
            }            

            try
            {
                _PostRepo.SubmitPost(Post);
                return checkingComp;
            }
            catch(Exception)
            {
                throw;
            }
        }

        //we gone all the way down here, operation must be completed successfully by now
        return checkingComp;
    }
    
    public Companion PetCompanion(int userID, int companionID)
    {
        try
        {
            Companion companionInstance = _compRepo.GetCompanionByCompanionId(companionID);

            if(userID == null)
            {
                throw new UserNotFound();
            }
            if(companionID == null)
            {
                throw new CompNotFound();
            }                       

            Companion companionInstance2 = _interRepo.PetCompanion(userID, companionID);

            Random RNGjesusManifested = new Random();

            int offSet = RNGjesusManifested.Next(-10,11);
            double compHung = companionInstance.Hunger ?? 75; //whoever set the mood and hunger to be nullable in the database needs to be condemned 
            double chanceRR = (100 * Math.Exp(-0.05*compHung)) + offSet; //Maths
            Console.WriteLine(100 * Math.Exp(-0.05*compHung));
            bool RR = (RNGjesusManifested.Next(010) < chanceRR); //see of the emotion gets re rolled
            if(RR)
            {
                try
                {
                    ReRollCompanionEmotion(companionID);
                }
                catch(Exception)
                {
                    throw;
                }
            }

            if(companionInstance.UserFk != userID) //If friend or stranger, make post [Companions user_FK]; if it is your own, pat yourself on the back.
            {
                User feedingUser = _userRepo.GetUserByUserId(userID);
                Post Post = new Post();

                if(companionInstance2.Mood > companionInstance.Mood)
                {
                    Post = new Post()//define post properties (This person came up and feed my companion!).
                    {
                        UserIdFk = companionInstance2.UserFk,
                        Content = feedingUser.Password + " pet my companion while I was away, thank you!"
                    };                    
                }
                else
                {
                    Post = new Post()//define post properties (This person came up and feed my companion!).
                    {
                        UserIdFk = companionInstance2.UserFk,
                        Content = feedingUser.Password + " pet my companion while it was hostile and it's mood went down... Thanks for nothing!"
                    };   
                }

                try
                {
                    _PostRepo.SubmitPost(Post);
                    return companionInstance2;
                }
                catch(Exception)
                {
                    throw;
                }
            }            

            return companionInstance;
        }
        catch (ResourceNotFound)
        {
            throw;
        }        
    }
    
    public bool SetShowcaseCompanion(int userId, int companionId)
    {
        try
        {
            return _interRepo.SetShowcaseCompanion(userId, companionId);
        }
        catch(CompNotFound)
        {
            throw;
        }
        catch(UserNotFound)
        {
            throw;
        }
    }

    public string PullConvo(int companionID)
    {
        return _interRepo.PullConvo(companionID);
    }
}