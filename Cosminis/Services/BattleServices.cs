using DataAccess.Entities;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class BattleServices
{
    //Honey wake up, it is time for you to write your dependacy injection!
    private readonly ICompanionDAO _compRepo;
	private readonly IUserDAO _userRepo;
    private readonly Interactions _InterRepo;

    public BattleServices(ICompanionDAO compRepo, IUserDAO userRepo, Interactions InterRepo)
    {
        this._compRepo = compRepo;
        this._userRepo = userRepo;
        this._InterRepo = InterRepo;
    }   
    public List<Companion> CreateRoster()
    {
        List<int> ReturnCompIDs = new List<int>();
        List<Companion> TrackingComps = new List<Companion>();
        int seed = 0;
        Random RNGesusIncarnated = new Random(); //hard coding the cap for now
        bool Worthy = false;

        while(!Worthy) //I wonder if this works
        {
            try
            {
                seed = RNGesusIncarnated.Next(1,100);
                Worthy = IsTheUserWorthy(seed);
                if(Worthy) //checking if the opponent have any companion at all
                {
                    TrackingComps = _compRepo.GetCompanionByUser(seed);
                } 
            }
            catch  //how to work with given contraints 101
            {
                throw;
            }
        }

        foreach(Companion Chomp in TrackingComps)
        {
            ReturnCompIDs.Add(Chomp.CompanionId);
        }

        return TrackingComps;
    }

    public List<Companion> CreateRoster(int OpponentID)
    {
        List<int> ReturnCompIDs = new List<int>();
        List<Companion> TrackingComps = new List<Companion>();
        bool Worthy = false;

        try
        {
            Worthy = IsTheUserWorthy(OpponentID);
            if(Worthy) //checking if the opponent have any companion at all
            {
                TrackingComps = _compRepo.GetCompanionByUser(OpponentID);
            } 
            else
            {
                throw new UserNotFound("Fight someone your sized why don't you");
            }
        }
        catch  //how to work with given contraints 101
        {
            throw;
        }

        foreach(Companion Chomp in TrackingComps)
        {
            ReturnCompIDs.Add(Chomp.CompanionId);
        }

        return TrackingComps;
    }

    public bool IsTheUserWorthy(int OpponentID)
    {
        Random RNGesusIncarnated = new Random();
        try
        {
            _compRepo.GetCompanionByUser(OpponentID);
            return true;
        }
        catch(UserNotFound)
        {
            return false;
        }
    }

    public int BattleResult(int CombatantZero, int CombatantOne) //return 2 if tie
    {
        int? ZeroPower = 0;
        int? OnePower = 0;
        int? hungerDiff = 0;
        int? moodDiff = 0;
        Companion ZeroComp = new Companion(); //forward declaration
        Companion OneComp = new Companion();
        Species ZeroSpe = new Species();
        Species OneSpe = new Species();
        EmotionChart EmotionZero = new EmotionChart();
        EmotionChart EmotionOne = new EmotionChart();
        Random RNGjesusManifested = new Random(); 
        
        try
        {
            ZeroComp = _compRepo.GetCompanionByCompanionId(CombatantZero);
            OneComp = _compRepo.GetCompanionByCompanionId(CombatantOne);
            ZeroSpe = _compRepo.FindSpeciesByID(ZeroComp.SpeciesFk);
            OneSpe = _compRepo.FindSpeciesByID(OneComp.SpeciesFk);
            EmotionZero = _InterRepo.GetEmotionByEmotionId(ZeroComp.Emotion);
            EmotionOne = _InterRepo.GetEmotionByEmotionId(OneComp.Emotion);
            hungerDiff = ZeroComp.Hunger - OneComp.Hunger;
            moodDiff = ZeroComp.Mood - OneComp.Mood;
        }
        catch
        {
            throw;
        }
        
        if(ZeroSpe.OpposingEle == OneSpe.OpposingEle)
        {
            ZeroPower = ZeroPower + 50;
        }
        else if(OneSpe.OpposingEle == ZeroSpe.OpposingEle)
        {
            OnePower = OnePower + 50;
        }

        if(hungerDiff>0)
        {
            ZeroPower = ZeroPower + (hungerDiff/2);
        }
        else if(hungerDiff<0)
        {
            OnePower = OnePower + (hungerDiff/-2);
        }

        if(moodDiff>0)
        {
            ZeroPower = ZeroPower + (moodDiff/2);
        }
        else if(moodDiff<0)
        {
            OnePower = OnePower + (moodDiff/-2);
        }

        ZeroPower = ZeroPower + (EmotionZero.Quality * 3);
        OnePower = OnePower + (EmotionOne.Quality * 3);
        ZeroPower = ZeroPower + RNGjesusManifested.Next(-10,11);
        OnePower = OnePower + RNGjesusManifested.Next(-10,11);
        
        if(ZeroPower>OnePower)
        {
            return 0; //combatant Zero won
        }
        else if(OnePower>ZeroPower)
        {
            return 1; //combatant One won
        }
        else
        {
            return 2; //Tie
        }
    }

    public int JudgingDiffculty(int[] RosterOne, int[] RosterTwo) //returns [-100,100] -100 means you are guaranteed to win and you get no reward from doing so, 100 means you are guaranteed to lose but if you somehow win you get double the reward
    {
        int returnValue = 0;

        List<Companion> CompOne = new List<Companion>();
        List<Companion> CompTwo = new List<Companion>();
        List<int> CompOneHunger = new List<int>();
        List<int> CompTwoHunger = new List<int>();
        List<int> CompOneMood = new List<int>();
        List<int> CompTwoMood = new List<int>();
        Random RNGjesusManifested = new Random(); 

        try
        {
            foreach(int i in RosterOne)
            {
                CompOne.Add(_compRepo.GetCompanionByCompanionId(i)); //fetch the lists
            }
            foreach(int i in RosterTwo)
            {
                CompTwo.Add(_compRepo.GetCompanionByCompanionId(i));
            }
            foreach(Companion comp in CompOne)
            {
                CompOneHunger.Add(comp.Hunger ?? 0); //gather their combat relevant stats
                CompOneMood.Add(comp.Mood ?? 0);
            }
            foreach(Companion comp in CompTwo)
            {
                CompTwoHunger.Add(comp.Hunger ?? 0);
                CompTwoMood.Add(comp.Mood ?? 0);
            }

            returnValue = (int) (-1 * (((CompOneHunger.Average()/2)-(CompTwoHunger.Average()/2)) + ((CompOneMood.Average()/2)-(CompTwoMood.Average()/2))));
            returnValue = returnValue + RNGjesusManifested.Next(-10,10);
            if(returnValue>100)
            {
                returnValue = 100;
            }
            if(returnValue<-100)
            {
                returnValue = -100;
            }
        }
        catch
        {
            throw;
        }

        return returnValue;
    }
}
