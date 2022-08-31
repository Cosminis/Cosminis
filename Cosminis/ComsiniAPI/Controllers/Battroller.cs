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
    public ActionResult<List<int>> CreateRoster()
    {
        try
        {
            List<int> ReturnCompIDs = _service.CreateRoster();
            return Ok(ReturnCompIDs);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Route("/Battle/Opponent")]
    [HttpGet()]
    public ActionResult<List<int>> CreateRoster(int OpponentID)
    {
        try
        {
            List<int> ReturnCompIDs = _service.CreateRoster(OpponentID);
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
}
