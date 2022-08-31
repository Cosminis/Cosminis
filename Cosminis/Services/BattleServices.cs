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

    public BattleServices(ICompanionDAO compRepo, IUserDAO userRepo)
    {
        this._compRepo = compRepo;
        this._userRepo = userRepo;
    }   
    public List<int> CreateRoster()
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

        return ReturnCompIDs;
    }

    public List<int> CreateRoster(int OpponentID)
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

        return ReturnCompIDs;
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
        
        try
        {
            ZeroComp = _compRepo.GetCompanionByCompanionId(CombatantZero);
            OneComp = _compRepo.GetCompanionByCompanionId(CombatantOne);
            ZeroSpe = _compRepo.FindSpeciesByID(ZeroComp.SpeciesFk);
            OneSpe = _compRepo.FindSpeciesByID(OneComp.SpeciesFk);
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
}
