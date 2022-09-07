using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

[ApiController]
public class BattleController : ControllerBase
{
    private readonly BattleServices _service;

    public BattleController(BattleServices service)
    {
        this._service = service;
    }

    [Route("/Battle/Roster")]
    [HttpGet()]
    public ActionResult<List<Companion>> CreateRoster()
    {
        try
        {
            List<Companion> ReturnCompIDs = _service.CreateRoster();
            return Ok(ReturnCompIDs);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Route("/Battle/Opponent")]
    [HttpGet()]
    public ActionResult<List<Companion>> CreateRoster(int OpponentID)
    {
        try
        {
            List<Companion> ReturnCompIDs = _service.CreateRoster(OpponentID);
            return Ok(ReturnCompIDs);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Route("/Battle/Result")]
    [HttpGet()]
    public ActionResult<int> BattleResult(int CombatantZero, int CombatantOne)
    {
        try
        {
            int ReturnCompIDs = _service.BattleResult(CombatantZero, CombatantOne);
            return Ok(ReturnCompIDs);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    
    [Route("/Battle/Scalar")]
    [HttpPut()]
    public ActionResult<int> JudgingDiffcult(int[] Roster, int SizeOne)
    {
        try
        {
            List<int> TempList = new List<int>();
            foreach(int com in Roster)
            {
                TempList.Add(com);
            }
            int[] tempArray = TempList.ToArray();      //the comment ending was here before!
            int[] RosterOne = Roster.Take(SizeOne).ToArray();
            int[] RosterTwo = Roster.Skip(SizeOne).ToArray();
            int ReturnCompIDs = _service.JudgingDiffculty(RosterOne, RosterTwo);
            return Ok(ReturnCompIDs);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
